// app/api/machines/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all machines (proper method handling)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    // Add validation
    if (category && typeof category !== "string") {
      return NextResponse.json(
        { error: "Invalid category parameter" },
        { status: 400 }
      );
    }

    const machines = await prisma.machine.findMany({
      where: category ? { 
        category: {
          equals: category.trim(), // Trim whitespace
          mode: 'insensitive'
        }
      } : undefined
    });

    console.log(`Fetched ${machines.length} machines for category: ${category}`); // Debug log
    return NextResponse.json(machines, { status: 200 });
  } catch (error) {
    console.error("[MACHINES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch machines" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Enhanced validation
    const requiredFields = ["slug", "model",  "image", "description", "category", "specs"];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Convert specs safely
    let specsObject = {};
    if (Array.isArray(data.specs)) {
      try {
        specsObject = Object.fromEntries(
          data.specs.filter(([key, value]: [string, unknown]) => key && value) // Filter out empty entries
        );
      } catch (error) {
        console.error("Specs conversion error:", error);
        return NextResponse.json(
          { error: "Invalid specs format" },
          { status: 400 }
        );
      }
    } else {
      specsObject = data.specs;
    }

    // Check for existing slug
    const existingMachine = await prisma.machine.findUnique({
      where: { slug: data.slug },
    });

    if (existingMachine) {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 409 }
      );
    }

    // Create new machine with proper typing
    const newMachine = await prisma.machine.create({
      data: {
        slug: data.slug.toLowerCase().replace(/\s+/g, '-'),
        model: data.model,
        image: data.image,
        description: data.description,
        category: data.category,
        specs: specsObject,
        videoUrl: data.videoUrl || null, // Add this
      },
    });

    return NextResponse.json(newMachine, { status: 201 });
  } catch (error: any) {
    console.error("Full error details:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}