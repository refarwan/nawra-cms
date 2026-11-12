import { decodeClientJwt } from "../utils/jwt-client";

import type { AuthUser } from "../../app.d";

class AuthStore {
  accessToken = $state<string | null>(null);
  user = $state<AuthUser | null>(null);
  initialized = $state(false);

  private clearListeners: (() => void)[] = [];

  onClear(fn: () => void): () => void {
    this.clearListeners.push(fn);
    return () => {
      this.clearListeners = this.clearListeners.filter((l) => l !== fn);
    };
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
    const decoded = decodeClientJwt(token);
    if (decoded) {
      this.user = {
        id: decoded.sub,
        username: decoded.username || decoded.email.split("@")[0],
        email: decoded.email,
        name: decoded.name,
        avatarUrl: decoded.avatarUrl || "",
        role: decoded.role,
        createdAt: decoded.iat * 1000
      };
    }
    this.initialized = true;
  }

  setUser(user: AuthUser | null): void {
    this.user = user;
    this.initialized = true;
  }

  clear(): void {
    this.accessToken = null;
    this.user = null;
    this.initialized = true;
    for (const fn of this.clearListeners) {
      fn();
    }
  }
}

export const authStore = new AuthStore();
