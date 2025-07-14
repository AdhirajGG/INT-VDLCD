// app/api/testimonials/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { name, position, company, content, avatarUrl } = await request.json();

  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        position,
        company,
        content,
        avatarUrl: avatarUrl || null,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Failed to add testimonial:", error);
    return NextResponse.json( 
      { error: "Failed to add testimonial" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}