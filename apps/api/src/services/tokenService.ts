import { fetch } from "bun";
import { prisma } from "../lib/prisma";

const ACCESS_KEY =(email: string) => `access_token${email}` 

export async function saveToken(email: string, refreshToken: string) {
   let user = await prisma.findUnique
}