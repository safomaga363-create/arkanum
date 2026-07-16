import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const lesson = await prisma.lesson.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isPublished: true,
      },
      include: {
        learningPath: {
          select: {
            id: true,
            title: true,
            slug: true,
            color: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Get next and previous lessons
    const [prevLesson, nextLesson] = await Promise.all([
      prisma.lesson.findFirst({
        where: {
          learningPathId: lesson.learningPathId,
          sortOrder: { lt: lesson.sortOrder },
          isPublished: true,
        },
        orderBy: { sortOrder: "desc" },
        select: { id: true, title: true, slug: true },
      }),
      prisma.lesson.findFirst({
        where: {
          learningPathId: lesson.learningPathId,
          sortOrder: { gt: lesson.sortOrder },
          isPublished: true,
        },
        orderBy: { sortOrder: "asc" },
        select: { id: true, title: true, slug: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...lesson,
        prevLesson,
        nextLesson,
      },
    });
  } catch (error) {
    console.error("Get lesson error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
