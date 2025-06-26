// app/api/blog/[slug]/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch approved comments for a blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Get the blog post first
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Fetch only approved comments
    const comments = await prisma.comment.findMany({
      where: {
        postId: post.id,
        isApproved: true
      },
      include: {
        author: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST - Create a new comment (requires authentication)
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { slug } = params;
    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Get the blog post
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Ensure user exists in our database
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: { lastActiveAt: new Date() },
      create: {
        clerkId: userId,
        email: "user@example.com", // You might want to get this from Clerk
        lastActiveAt: new Date()
      }
    });

    // Create the comment (will be pending approval)
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: userId,
        postId: post.id,
        isApproved: false // Comments start as unapproved
      },
      include: {
        author: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}