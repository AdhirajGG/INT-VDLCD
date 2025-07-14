// // app/api/users/active/route.ts
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function GET() {
//   try {
//     // Active users: last active within 30 minutes
//     const activeCount = await prisma.user.count({
//       where: {
//         lastActiveAt: {
//           gte: new Date(Date.now() - 30 * 60 * 1000),
//         },
//       },
//     });

//     return NextResponse.json({ count: activeCount });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch active users" },
//       { status: 500 }
//     );
//   }
// }

// app/api/users/active/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Optional: Check if user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Active users: last active within 30 minutes
    const activeCount = await prisma.userActivity.count({
      where: {
        lastActiveAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000),
        },
      },
    });

    return NextResponse.json({ count: activeCount });
  } catch (error) {
    console.error("Failed to fetch active users:", error);
    return NextResponse.json(
      { error: "Failed to fetch active users" },
      { status: 500 }
    );
  }
}
