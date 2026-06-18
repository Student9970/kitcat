/**
 * Minimal password gate for the LOCAL, development-only admin dashboard.
 * This is not a production auth system — admin never ships to production.
 */
const PASSWORD = process.env.ADMIN_PASSWORD || "admin";

export function isAuthorized(request: Request): boolean {
  const header = request.headers.get("x-admin-password");
  return !!header && header === PASSWORD;
}

export function checkPassword(password: string): boolean {
  return password === PASSWORD;
}

export function unauthorized(): Response {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
