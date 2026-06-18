import { isAuthorized, unauthorized } from "@/lib/admin/auth";
import {
  deleteImage,
  ImageValidationError,
  listImages,
  saveImage,
} from "@/lib/admin/images-store";

export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  return Response.json({ images: listImages() });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "No file provided." }, { status: 400 });
    }
    const image = await saveImage(file);
    return Response.json({ image }, { status: 201 });
  } catch (err) {
    if (err instanceof ImageValidationError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name) return Response.json({ error: "Missing image name." }, { status: 400 });
  deleteImage(name);
  return Response.json({ ok: true });
}
