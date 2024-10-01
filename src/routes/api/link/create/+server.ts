import prisma from "$lib/database/Prisma";
import { rateLimit } from "$lib/RateLimit";
import z from "zod";
import type { RequestEvent } from "./$types";

export async function POST({ request, getClientAddress }: RequestEvent): Promise<Response> {
  if (rateLimit(getClientAddress())) {
    return new Response("Too Many Requests: You have exceeded the rate limit", { status: 429 });
  }
  if (!request.body) {
    return new Response("Bad Request: Your request body is empty", { status: 400 });
  }

  const body = await request.json();
  const schema = z
    .object({
      url: z.string().url(),
      slug: z.string(),
      userId: z.string().optional(),
      visitorId: z.string()
    })
    .safeParse(body);

  if (!schema.success) {
    return new Response("Bad Request: Your request body is invalid", { status: 400 });
  }

  const link = await prisma.link.create({
    data: {
      url: schema.data.url,
      slug: schema.data.slug,
      userId: schema.data.userId || null,
      visitorId: schema.data.visitorId,
      ipAddr: getClientAddress()
    }
  });

  if (!link) return new Response("Internal Server Error: Failed to create link", { status: 500 });
  return new Response(JSON.stringify(link), { status: 201 });
}