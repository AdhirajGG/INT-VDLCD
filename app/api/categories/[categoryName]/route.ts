// app/categories/[categoryName]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/clerkAdmin";

// Update category name
// export async function PUT(req: NextRequest, { params }: { params: { categoryName: string } }) {
//   const { name } = await req.json();
//   const oldName = decodeURIComponent(params.categoryName);

//   if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

//   try {
//     const updated = await prisma.category.updateMany({
//       where: { name: oldName },
//       data: { name },
//     });
//     return NextResponse.json({ success: true, updated });
//   } catch (e) {
//     return NextResponse.json({ error: "Update failed" }, { status: 500 });
//   }
// }

export async function PUT(req: NextRequest, { params }: { params: { categoryName: string } }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const { name } = await req.json();
    const updated = await prisma.category.update({
      where: { id: Number(params.categoryName) },
      data: { name }
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// Delete category and all machines in this category
// Can give Error in production
export async function DELETE(req: NextRequest, { params }: { params: { categoryName: string } }) {
  const oldName = decodeURIComponent(params.categoryName);

  try {
    // Delete all machines in this category first
    await prisma.machine.deleteMany({ 
      where: { category: oldName } 
    });
    
    // Then delete the category
    await prisma.category.deleteMany({ 
      where: { name: oldName } 
    });
    
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}