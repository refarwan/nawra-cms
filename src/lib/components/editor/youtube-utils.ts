export const DEFAULT_YOUTUBE_URL = "https://www.youtube.com/watch?v=twDrZjustgQ&t=46s";
export const DEFAULT_YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/qS2BQoj9WVE";

function parseStartSeconds(raw: string | null): number | null {
  if (!raw) return null;
  if (/^\d+$/.test(raw)) return parseInt(raw, 10);

  const match = raw.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/i);
  if (!match) return null;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  const total = hours * 3600 + minutes * 60 + seconds;
  return total > 0 ? total : null;
}

/**
 * Mengubah URL YouTube biasa (watch, youtu.be, shorts, live, embed) atau Video ID
 * menjadi URL embed resmi YouTube (https://www.youtube.com/embed/VIDEO_ID).
 */
export function toYouTubeEmbedUrl(input?: string | null): string {
  const trimmed = (input || "").trim();
  if (!trimmed) return DEFAULT_YOUTUBE_EMBED_URL;

  // Jika user hanya menempelkan 11 karakter Video ID langsung
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./i, "").replace(/^m\./i, "");

    let videoId: string | null = null;

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] || null;
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v");
      } else {
        const parts = url.pathname.split("/").filter(Boolean);
        if (
          parts.length >= 2 &&
          (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live" || parts[0] === "v")
        ) {
          videoId = parts[1];
        }
      }
    }

    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      const startParam =
        parseStartSeconds(url.searchParams.get("start")) ??
        parseStartSeconds(url.searchParams.get("t"));
      const query = startParam ? `?start=${startParam}` : "";
      return `https://www.youtube.com/embed/${videoId}${query}`;
    }
  } catch {
    // Fallback regex jika URL tidak standar
  }

  const regexMatch = trimmed.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts|live)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (regexMatch?.[1]) {
    return `https://www.youtube.com/embed/${regexMatch[1]}`;
  }

  return trimmed;
}
