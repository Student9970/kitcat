import { isAuthorized, unauthorized } from "@/lib/admin/auth";
import {
  deletePost,
  getPostBySlug,
  promoteDraftFile,
  updatePost,
  type PostInput,
} from "@/lib/admin/posts-store";

interface Ctx {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: Ctx) {
  if (!isAuthorized(request)) return unauthorized();
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ post });
}

export async function PUT(request: Request, { params }: Ctx) {
  if (!isAuthorized(request)) return unauthorized();
  const { slug } = await params;
  try {
    const body = (await request.json()) as PostInput;
    const post = updatePost(slug, {
      ...body,
      tags: Array.isArray(body.tags) ? body.tags : [],
      status: body.status === "published" ? "published" : "draft",
    });
    return Response.json({ post });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  if (!isAuthorized(request)) return unauthorized();
  const { slug } = await params;
  try {
    const post = promoteDraftFile(slug);
    return Response.json({ post });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  if (!isAuthorized(request)) return unauthorized();
  const { slug } = await params;
  deletePost(slug);
  return Response.json({ ok: true });
}
