// app/api/machines/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/clerkAdmin";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const machine = await prisma.machine.findUnique({
      where: { slug: params.slug },
    });

    if (!machine) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(machine);
  } catch (err) {
    console.error("GET /api/machines/[slug] error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// UPDATE machine
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const requiredFields = ["model", "image", "description", "category", "specs"];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const updatedMachine = await prisma.machine.update({
      where: { slug: params.slug },
      data: {
        model: data.model,
        image: data.image,
        description: data.description,
        category: data.category,
        specs: data.specs,
        videoUrl: data.videoUrl || null, // Add this
      },
    });

    return NextResponse.json(updatedMachine, { status: 200 });
  } catch (error: any) {
    console.error("[MACHINE_PUT]", error);
    const errorMessage = error.message || "Failed to update machine";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Add DELETE handler
export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.machine.delete({
      where: { slug: params.slug }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[MACHINE_DELETE]", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete machine" },
      { status: 500 }
    );
  }
}