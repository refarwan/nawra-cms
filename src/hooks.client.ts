import type { HandleClientError } from "@sveltejs/kit/hooks";

export const handleError: HandleClientError = async ({ error, event }) => {
  console.error("Client Error at", event.url.href, error);
  return {
    message: error instanceof Error ? error.message : "Terjadi kesalahan internal."
  };
};
