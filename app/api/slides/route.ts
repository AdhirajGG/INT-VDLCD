// app/api/slides/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { imageUrl, topText, bottomText } = await request.json();

  try {
    const slide = await prisma.slide.create({
      data: {
        imageUrl,
        topText: topText || null,
        bottomText: bottomText || null,
      },
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.error("Failed to add slide:", error);
    return NextResponse.json(
      { error: "Failed to add slide" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const slides = await prisma.slide.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(slides);
  } catch (error) {
    console.error("Failed to fetch slides:", error);
    return NextResponse.json(
      { error: "Failed to fetch slides" },
      { status: 500 }
    );
  }
}