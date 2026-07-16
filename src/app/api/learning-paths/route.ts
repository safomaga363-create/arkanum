import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const paths = await prisma.learningPath.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { lessons: { where: { isPublished: true } } },
        },
      },
    });

    return NextResponse.json({ success: true, data: paths });
  } catch (error) {
    console.error("Get learning paths error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// cache clear
