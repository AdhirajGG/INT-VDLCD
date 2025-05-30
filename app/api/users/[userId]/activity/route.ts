// app/api/users/[userId]/activity/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await prisma.user.update({
      where: { id: params.userId },
      data: { lastActiveAt: new Date() }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update activity" },
      { status: 500 }
    );
  }
}