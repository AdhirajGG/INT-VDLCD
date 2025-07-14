// // app/api/users/[userId]/activity/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { userId: string } }
// ) {
//   try {
//     // Find user by clerkId
//     const user = await prisma.user.findUnique({
//       where: { id: params.userId }
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     await prisma.user.update({
//       where: { id: user.id },
//       data: { lastActiveAt: new Date() }
//     });
    
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Activity update error:", error);
//     return NextResponse.json(
//       { error: "Failed to update activity" },
//       { status: 500 }
//     );
//   }
// }
// app/api/users/[userId]/activity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Get authenticated user
    const { userId: authUserId } = await auth();
    
    if (!authUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify the user exists in Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(params.userId);
    
    if (!clerkUser) {
      return NextResponse.json(
        { error: "User not found in Clerk" },
        { status: 404 }
      );
    }

    // Update or create user activity in your database
    await prisma.userActivity.upsert({
      where: { 
        // Replace 'id' with your actual unique field name if different
        id: params.userId 
      },
      update: { 
        lastActiveAt: new Date() 
      },
      create: {
        // Make sure 'id' or the unique field matches your schema
        id: params.userId,
        lastActiveAt: new Date(),
        user: {
          connect: { id: params.userId }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Activity update error:", error);
    return NextResponse.json(
      { error: "Failed to update activity" },
      { status: 500 }
    );
  }
}