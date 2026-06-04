// Simple password-based authentication for admin panel
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "krp.admin.2024";

export function validateAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function setAdminSession(password: string): void {
  if (typeof window !== "undefined") {
    const token = Buffer.from(`admin:${password}`).toString("base64");
    sessionStorage.setItem("admin_token", token);
  }
}

export function getAdminSession(): string | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("admin_token");
  }
  return null;
}

export function isAdminAuthenticated(): boolean {
  const token = getAdminSession();
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [, password] = decoded.split(":");
    return validateAdminPassword(password);
  } catch {
    return false;
  }
}

export function clearAdminSession(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("admin_token");
  }
}
