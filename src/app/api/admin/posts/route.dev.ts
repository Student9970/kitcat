import { isAuthorized, unauthorized } from "@/lib/admin/auth";
import {
  createPost,
  listAllPosts,
  SlugConflictError,
  type PostInput,
} from "@/lib/admin/posts-store";

export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  return Response.json({ posts: listAllPosts() });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  try {
    const body = (await request.json()) as PostInput;
    if (!body.title?.trim()) {
      return Response.json({ error: "Title is required." }, { status: 400 });
    }
    const post = createPost({
      ...body,
      tags: Array.isArray(body.tags) ? body.tags : [],
      status: body.status === "published" ? "published" : "draft",
    });
    return Response.json({ post }, { status: 201 });
  } catch (err) {
    if (err instanceof SlugConflictError) {
      return Response.json({ error: err.message }, { status: 409 });
    }
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
