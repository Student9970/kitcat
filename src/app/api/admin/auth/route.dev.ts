import { checkPassword } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: "" }));
  if (checkPassword(String(password ?? ""))) {
    return Response.json({ ok: true });
  }
  return Response.json({ ok: false, error: "Incorrect password" }, { status: 401 });
}
