// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/clerkAdmin";

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST add a new category (admin only)
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }
    const category = await prisma.category.create({ data: { name } });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("[CATEGORIES_POST]", error);
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const { name } = await req.json();
    const updated = await prisma.category.update({
      where: { id: Number(params.id) },
      data: { name }
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    await prisma.category.delete({
      where: { id: Number(params.id) }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}