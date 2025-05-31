// app/api/blog/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/clerkAdmin";

// GET single blog post
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error("[BLOG_SLUG_GET]", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// UPDATE blog post (admin only)
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, image, content, excerpt } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const updatedPost = await prisma.blogPost.update({
      where: { slug: params.slug },
      data: { title, image, content, excerpt },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("[BLOG_SLUG_PUT]", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE blog post (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.blogPost.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BLOG_SLUG_DELETE]", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}