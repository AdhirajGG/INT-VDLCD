// app/api/admin/comments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { prisma } from "@/lib/prisma";

// PUT - Approve/Disapprove a comment
export async function PUT(
  request: NextRequest,
 { params }: { params: { id: string } } // Explicitly define id parameter
) {
     const id = params.id; // Directly access id without array check
  
  // Validate ID
  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json(
      { error: "Invalid comment ID" },
      { status: 400 }
    );
  }
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

    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const { isApproved } = await request.json();

    const comment = await prisma.comment.update({
      where: { id: parseInt(id) }, // Use extracted id
      data: { isApproved },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });

    // Get user details from Clerk
    try {
      const clerkUser = await clerkClient.users.getUser(comment.authorId);
      const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
      
      const commentWithUserDetails = {
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

      return NextResponse.json(commentWithUserDetails);
    } catch (error) {
      console.error(`Error fetching user details for ${comment.authorId}:`, error);
      // Return comment with fallback user data
      const commentWithFallback = {
        ...comment,
        author: {
          id: comment.authorId,
          email: 'deleted@user.com',
          name: 'Deleted User',
          imageUrl: null,
          username: 'deleted_user'
        }
      };
      return NextResponse.json(commentWithFallback);
    }
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a comment
export async function DELETE(
  request: NextRequest,
 { params }: { params: { id: string } } // Explicitly define id parameter
) {
   const id = params.id; // Directly access id without array check
   // Validate ID
  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json(
      { error: "Invalid comment ID" },
      { status: 400 }
    );
  }
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

    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}