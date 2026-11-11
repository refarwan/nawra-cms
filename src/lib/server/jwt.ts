// Web Crypto HMAC-SHA256 JWT implementation for Cloudflare Workers & Node/Bun

const DEFAULT_JWT_SECRET = "nawra-cms-jwt-secret-key-32-chars-long-minimum!";

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array<ArrayBuffer> {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret || DEFAULT_JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signJwt(
  payload: Record<string, unknown>,
  secret = DEFAULT_JWT_SECRET
): Promise<string> {
  const enc = new TextEncoder();
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(enc.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(enc.encode(JSON.stringify(payload)));
  const data = `${encodedHeader}.${encodedPayload}`;

  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const encodedSignature = base64UrlEncode(new Uint8Array(signature));

  return `${data}.${encodedSignature}`;
}

export async function verifyJwt<T = Record<string, unknown>>(
  token: string,
  secret = DEFAULT_JWT_SECRET
): Promise<T | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const signatureBytes = base64UrlDecode(encodedSignature);

  try {
    const key = await getHmacKey(secret);
    const enc = new TextEncoder();
    const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes, enc.encode(data));

    if (!isValid) return null;

    const payloadBytes = base64UrlDecode(encodedPayload);
    const payloadStr = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadStr) as T & { exp?: number };

    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadBytes = base64UrlDecode(parts[1]);
    const payloadStr = new TextDecoder().decode(payloadBytes);
    return JSON.parse(payloadStr) as T;
  } catch {
    return null;
  }
}
