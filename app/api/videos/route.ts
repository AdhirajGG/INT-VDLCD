// // app/api/videos/route.ts
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function GET() {
//   try {
//     const categories = await prisma.videoCategory.findMany({
//       include: { videos: true }
//     });
//     return NextResponse.json(categories);
//   } catch (error) {
//     console.error("Failed to fetch videos:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch videos" },
//       { status: 500 }
//     );
//   }
// }

// app/api/videos/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.videoCategory.findMany({
      include: { 
        videos: {
          orderBy: {
            // Replace 'createdAt' with the correct field name, e.g., 'created_date' or another valid field
            // Example:
            // created_date: 'desc'
            id: 'desc' // Use 'id' if you want to order by the primary key as a fallback
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}