// lib/clerkAdmin.ts
import { currentUser } from "@clerk/nextjs/server";

export async function isAdmin() {
  const user = await currentUser();
  // You can use Clerk's publicMetadata or roles for admin check
  return user?.publicMetadata?.role === "admin";
}