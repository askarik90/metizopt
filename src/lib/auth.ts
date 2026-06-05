/**
 * Shared auth constants — работает в Edge и Node.js
 * Логика хэширования вынесена в отдельные серверные функции
 */
export const COOKIE_NAME = "krp_admin";
export const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 часов

/**
 * Простая генерация токена сессии из пароля
 * Используется только в Node.js route handlers (не в middleware)
 */
export async function generateSessionToken(password: string): Promise<string> {
  const secret = process.env.ADMIN_SECRET || "krp-secret-change-me";
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(password));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Проверка токена — Edge-совместимая (Web Crypto)
 */
export async function validateToken(token: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD || "krp.admin.2024";
  const expected = await generateSessionToken(password);
  if (token.length !== expected.length) return false;
  // Constant-time comparison
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
