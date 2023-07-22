import { prisma } from "#/lib/db/prisma";
import jwt from "jsonwebtoken";
import { z } from "zod";

const DecodedJwtSchema = z.object({ linkfy: z.boolean() });
const EnvirontmentSchema = z.object({ JWT_SECRET_KEY: z.string() });

export const authenticateRequest = async(request: Request, withApiKey = true): Promise<{ userId: string | undefined; success: boolean}> => {
  if (withApiKey) {
    const apiKey = request.headers.get("apiKey");
    if (apiKey) {
      const userId = await isValidKey(apiKey);
      if (!userId) return { userId: undefined, success: false };
      if (userId) return { userId, success: true };
    }
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { userId: undefined, success: false };
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const environtment = EnvirontmentSchema.safeParse(process.env);
    if (!environtment.success) return { userId: undefined, success: false };
    const decodedToken = DecodedJwtSchema.safeParse(jwt.verify(token, environtment.data.JWT_SECRET_KEY));
    if (!decodedToken.success) return { userId: undefined, success: false };

    return { userId: undefined, success: false };
  } catch (error) {
    return { userId: undefined, success: false };
  }
};

export const isValidKey = async(apiKey: string): Promise<string | false> => {
  const result = await prisma.user.findUnique({ where: { apiKey } });
  if (!result) return false;
  return result.id;
};