import { isAuthorized, unauthorized } from "@/lib/admin/auth";
import { listCategories, listTags } from "@/lib/admin/posts-store";

export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  return Response.json({ categories: listCategories(), tags: listTags() });
}
