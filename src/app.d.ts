export interface UserSession {
  id: string;
  userId: string;
  expiresAt: number;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: "admin" | "editor";
  createdAt: number;
  updatedAt?: number;
}

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: AuthUser | null;
      session: UserSession | null;
      accessToken: string | null;
    }
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      context?: unknown;
    }
  }
}

export {};
