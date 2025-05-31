// app/api/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/clerkAdmin";

// GET all blog posts
// export async function GET() {
//   try {
//     const posts = await prisma.blogPost.findMany({
//       orderBy: { createdAt: "desc" },
//     });
//     return NextResponse.json(posts);
//   } catch (error) {
//     console.error("[BLOG_GET]", error);
//     return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
//   }
// }
// above code was working

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit');
    
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined
    });
    
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST create new blog post (admin only)
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, slug, image, content, excerpt } = await req.json();
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const post = await prisma.blogPost.create({
      data: { title, slug, image, content, excerpt },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("[BLOG_POST]", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}