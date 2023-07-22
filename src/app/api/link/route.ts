import { authenticateRequest } from "#/lib/utils/api/keys";
import { NextResponse } from "next/server";
import { prisma } from "#/lib/db/prisma";
import { z } from "zod";

export async function GET(request: Request): Promise<NextResponse> {
  const data = await authenticateRequest(request);
  if (!data.success) return new NextResponse(JSON.stringify({ message: "Unauthorized", statusCode: 401 }), { status: 401 });

  const schema = z.object({ userId: z.string().optional(), success: z.boolean() }).safeParse(data);
  if (!schema.success) return new NextResponse(JSON.stringify({ message: "Unauthorized", statusCode: 401 }), { status: 401 });

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (!slug) return NextResponse.json({ message: "Parameter `slug` is required" }, { status: 400 });

  const link = await prisma.link.findFirst({ where: { slug, userId: schema.data.userId || undefined } });

  if (!link) return NextResponse.json({ message: "Link not found" }, { status: 404 });

  return NextResponse.json({ link });
}