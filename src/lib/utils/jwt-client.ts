// Client-side JWT decoder without external dependencies

export interface DecodedJwtUser {
  sub: string;
  username?: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: "admin" | "editor";
  exp: number;
  iat: number;
}

export function decodeClientJwt(token: string): DecodedJwtUser | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(json) as DecodedJwtUser;
  } catch {
    return null;
  }
}
