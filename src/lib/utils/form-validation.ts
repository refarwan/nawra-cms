const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,30}$/;
const SLUG_REGEX = /^[a-z0-9-]+$/;

export function isValidUsername(value: string): boolean {
  return USERNAME_REGEX.test(value.trim());
}

export function isValidEmail(value: string): boolean {
  const email = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidSlug(value: string): boolean {
  return SLUG_REGEX.test(value.trim());
}

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getUsernameErrors(
  value: string,
  hasSubmitted: boolean,
  serverError?: string
): string[] {
  const trimmed = value.trim();
  if (hasSubmitted) {
    if (!trimmed) return ["Username wajib diisi."];
    if (!isValidUsername(trimmed)) {
      return ["Username hanya boleh 3-30 karakter (huruf, angka, titik, strip, underscore)."];
    }
  }
  return serverError ? [serverError] : [];
}

export function getEmailErrors(
  value: string,
  hasSubmitted: boolean,
  serverError?: string
): string[] {
  const trimmed = value.trim();
  if (hasSubmitted) {
    if (!trimmed) return ["Alamat email wajib diisi."];
    if (!isValidEmail(trimmed)) return ["Format email tidak valid."];
  }
  return serverError ? [serverError] : [];
}

export function getRequiredErrors(
  value: string,
  label: string,
  hasSubmitted: boolean,
  serverError?: string
): string[] {
  if (hasSubmitted && !value.trim()) {
    return [`${label} wajib diisi.`];
  }
  return serverError ? [serverError] : [];
}

export function getSlugErrors(
  value: string,
  hasSubmitted: boolean,
  serverError?: string
): string[] {
  const trimmed = value.trim();
  if (hasSubmitted) {
    if (!trimmed) return ["Slug URL wajib diisi."];
    if (!isValidSlug(trimmed)) {
      return ["Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)."];
    }
  }
  return serverError ? [serverError] : [];
}

export function getPasswordErrors(
  password: string,
  hasSubmitted: boolean,
  serverError?: string
): string[] {
  if (hasSubmitted) {
    if (!password) return ["Kata sandi wajib diisi."];
    if (password.length < 6) return ["Kata sandi minimal 6 karakter."];
  }
  return serverError ? [serverError] : [];
}

export function getConfirmPasswordErrors(
  password: string,
  confirmPassword: string,
  hasSubmitted: boolean,
  serverError?: string
): string[] {
  if (hasSubmitted) {
    if (!confirmPassword) return ["Konfirmasi kata sandi wajib diisi."];
    if (password && confirmPassword !== password) return ["Konfirmasi kata sandi tidak cocok."];
  }
  return serverError ? [serverError] : [];
}
