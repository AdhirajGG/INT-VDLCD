// app/api/users/active/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
  try {
    const activeUsers = await prisma.user.count({
      where: {
        lastActiveAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
        }
      }
    });
    
    return NextResponse.json({ count: activeUsers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch active users" },
      { status: 500 }
    );
  }
}