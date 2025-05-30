
// app/api/addMachines/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/clerkAdmin";

// GET all machines, optionally by category
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const machines = await prisma.machine.findMany({  
      where: category ? { category } : undefined,
    });
    return NextResponse.json(machines, { status: 200 });
  } catch (error) {
    console.error("[MACHINES_GET]", error);
    return NextResponse.json({ error: "Failed to fetch machines" }, { status: 500 });
  }
}

// POST add a new machine (admin only)
export async function POST(req: NextRequest) {
  try {
    // Admin check
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
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
      specsObject = Object.fromEntries(
        data.specs.filter(([key, value]: [string, string]) => key && value)
      );
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

    // Create new machine
    const newMachine = await prisma.machine.create({
      data: {
        slug: data.slug.toLowerCase().replace(/\s+/g, '-'),
        model: data.model,
        image: data.image,
        description: data.description,
        category: data.category,
        specs: specsObject,
      },
    });

    return NextResponse.json(newMachine, { status: 201 });
  } catch (error: any) {
    console.error("[MACHINES_POST]", error);
    return NextResponse.json(
      { error: error.message || "Failed to add machine", details: error },
      { status: 500 }
    );
  }
}