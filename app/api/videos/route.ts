// app/api/videos/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try{
  const categories = await prisma.videoCategory.findMany({
    include: { videos: true }
  });
  return NextResponse.json(categories);
}catch (error) {
  return NextResponse.json(
    { error: 'Failed to fetch videos' },
    { status: 500 }
  );
}
}