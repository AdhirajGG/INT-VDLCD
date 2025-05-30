// app/api/videos/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.videoCategory.findMany({
    include: { videos: true }
  });
  return NextResponse.json(categories);
}