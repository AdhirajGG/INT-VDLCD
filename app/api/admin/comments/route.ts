// app/api/admin/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // ✅ use auth instead of useAuth (only in API routes)
import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅ FIXED import
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await  auth(); // ✅ use `auth()` in server functions

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await clerkClient.users.getUser(userId);
    const isAdmin = user.publicMetadata?.role === "admin";

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const comments = await prisma.comment.findMany({
      include: {
        author: {
          select: {
            id: true,
            email: true,
            clerkId: true
          }
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true
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

