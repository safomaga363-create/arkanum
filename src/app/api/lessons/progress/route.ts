import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const progressSchema = z.object({
  lessonId: z.string(),
  action: z.enum(["start", "complete", "skip"]),
  score: z.number().optional(),
});

// Get user's lesson progress
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lessonId");
    const learningPathId = searchParams.get("learningPathId");

    if (lessonId) {
      const progress = await prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId: session.user.id,
            lessonId,
          },
        },
      });
      return NextResponse.json({ success: true, data: progress });
    }

    if (learningPathId) {
      const allProgress = await prisma.lessonProgress.findMany({
        where: {
          userId: session.user.id,
          lesson: { learningPathId },
        },
        select: {
          lessonId: true,
          status: true,
          score: true,
          completedAt: true,
        },
      });
      return NextResponse.json({ success: true, data: allProgress });
    }

    return NextResponse.json(
      { success: false, error: "lessonId or learningPathId required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Get lesson progress error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Start, complete, or skip a lesson
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const data = progressSchema.parse(body);

    const lesson = await prisma.lesson.findUnique({
      where: { id: data.lessonId },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    const userId = session.user.id;

    if (data.action === "start") {
      const progress = await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId: data.lessonId,
          },
        },
        create: {
          userId,
          lessonId: data.lessonId,
          status: "IN_PROGRESS",
          attempts: 1,
        },
        update: {
          status: "IN_PROGRESS",
          attempts: { increment: 1 },
        },
      });

      return NextResponse.json({ success: true, data: progress });
    }

    if (data.action === "complete") {
      const score = data.score || 100;

      const progress = await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId: data.lessonId,
          },
        },
        create: {
          userId,
          lessonId: data.lessonId,
          status: "SOLVED",
          score,
          attempts: 1,
          completedAt: new Date(),
        },
        update: {
          status: "SOLVED",
          score,
          completedAt: new Date(),
        },
      });

      // Award XP
      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: lesson.xpReward },
        },
      });

      // Recalculate level
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true },
      });

      if (user) {
        const newLevel = Math.floor(user.xp / 500) + 1;
        await prisma.user.update({
          where: { id: userId },
          data: { level: newLevel },
        });
      }

      return NextResponse.json({
        success: true,
        data: progress,
        message: `Lesson completed! +${lesson.xpReward} XP`,
      });
    }

    if (data.action === "skip") {
      const progress = await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId: data.lessonId,
          },
        },
        create: {
          userId,
          lessonId: data.lessonId,
          status: "SKIPPED",
        },
        update: {
          status: "SKIPPED",
        },
      });

      return NextResponse.json({ success: true, data: progress });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Lesson progress error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
