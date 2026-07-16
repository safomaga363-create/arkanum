import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const path = await prisma.learningPath.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isPublished: true,
      },
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            contentType: true,
            difficulty: true,
            durationMin: true,
            points: true,
            xpReward: true,
            sortOrder: true,
          },
        },
      },
    });

    if (!path) {
      return NextResponse.json(
        { success: false, error: "Learning path not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: path });
  } catch (error) {
    console.error("Get learning path error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
