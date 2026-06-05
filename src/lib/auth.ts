/**
 * Auth helpers — Edge-compatible (no Node.js crypto)
 */

export const COOKIE_NAME = "krp_admin";
export const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 часов

/** Токен сессии из env (надёжный случайный токен) */
export function getSessionToken(): string {
  return process.env.ADMIN_SESSION_TOKEN ?? "fallback-dev-token-change-in-prod";
}

/** Проверка пароля */
export function checkPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD ?? "krp.admin.2024";
  return input === password;
}

/** Проверка токена cookie — простое сравнение */
export function validateToken(token: string): boolean {
  const expected = getSessionToken();
  if (!token || token.length !== expected.length) return false;
  // Constant-time comparison
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= (token.charCodeAt(i) || 0) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
