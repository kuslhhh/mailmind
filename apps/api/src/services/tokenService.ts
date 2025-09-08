import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";
import { fetch } from "bun";
const ACCESS_KEY = (email: string) => `access_token:${email}`;

export async function saveTokensForUser(email: string, refreshToken: string, accessToken?: string, expiresIn?: number, scope?: string) {

   let user = await prisma.user.findUnique({ where: { email } });
   if (!user) user = await prisma.user.create({
      data: {
         email,
         name: email.split("@")[0],
      }
   });

   await prisma.token.upsert({
      where: { id: `${user.id}-google` },
      create: {
         id: `${user.id}-google`,
         provider: "google",
         refreshToken,
         scope,
         userId: user.id,
      },
      update: {
         refreshToken,
         scope,
      },
   });

   if (accessToken && expiresIn) {
      await redis.setex(ACCESS_KEY(email), expiresIn, JSON.stringify({ token: accessToken }));
   }
}

export async function refreshAccessTokenWithGoogle(refreshToken: string) {
   const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
   });

   const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
   });

   if (!r.ok) throw new Error(`Failed to refresh token: ${r.status}`);
   return await r.json();
}

export async function getValidAccessTokenByEmail(email: string) {

   const cache = await redis.get(ACCESS_KEY(email));
   if (cache) {
      try { return JSON.parse(cache).token; } catch { /* continue */ }
   }

   const user = await prisma.user.findUnique({ where: { email }, include: { tokens: true } });
   if (!user) throw new Error("User not found");

   const tokenRow = user.tokens.find(t => t.provider === "google");
   if (!tokenRow) throw new Error("No google refresh token stored");

   const refreshed: any = await refreshAccessTokenWithGoogle(tokenRow.refreshToken);
   const accessToken = refreshed.access_token as string;
   const expiresIn = Number(refreshed.expires_in || 3600);

   await redis.setex(ACCESS_KEY(email), expiresIn, JSON.stringify({ token: accessToken }));

   return accessToken;
}
