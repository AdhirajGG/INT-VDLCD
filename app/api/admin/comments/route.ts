// app/api/admin/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await clerkClient.users.getUser(userId);
    const isAdmin = user.publicMetadata?.role === "admin";
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get all comments (pending and approved)
    const comments = await prisma.comment.findMany({
      include: {
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

    // Fetch user details from Clerk for each comment
    const commentsWithUserDetails = await Promise.all(
      comments.map(async (comment) => {
        try {
          const clerkUser = await clerkClient.users.getUser(comment.authorId);
          const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
          
          return {
            ...comment,
            author: {
              id: comment.authorId,
              email: userEmail,
              name: clerkUser.firstName && clerkUser.lastName 
                ? `${clerkUser.firstName} ${clerkUser.lastName}`
                : clerkUser.firstName || clerkUser.lastName || clerkUser.username || userEmail?.split('@')[0] || 'Anonymous',
              imageUrl: clerkUser.imageUrl,
              username: clerkUser.username || userEmail?.split('@')[0] || 'anonymous'
            }
          };
        } catch (error) {
          console.error(`Error fetching Clerk user ${comment.authorId}:`, error);
          // Fallback for deleted/invalid users
          return {
            ...comment,
            author: {
              id: comment.authorId,
              email: 'deleted@user.com',
              name: 'Deleted User',
              imageUrl: null,
              username: 'deleted_user'
            }
          };
        }
      })
    );

    return NextResponse.json(commentsWithUserDetails);
  } catch (error) {
    console.error("Error fetching admin comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}