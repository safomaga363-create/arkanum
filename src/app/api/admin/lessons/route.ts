import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const lessonSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  content: z.string().optional(),
  contentType: z.enum(["TEXT", "VIDEO", "INTERACTIVE", "QUIZ", "PRACTICAL"]).default("TEXT"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT", "LEGENDARY"]),
  durationMin: z.number().min(1).default(15),
  points: z.number().min(1).default(100),
  xpReward: z.number().min(1).default(50),
  learningPathId: z.string(),
});

// List lessons for a learning path
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const learningPathId = searchParams.get("learningPathId");

    const where: any = {};
    if (learningPathId) where.learningPathId = learningPathId;

    const lessons = await prisma.lesson.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      include: {
        learningPath: { select: { title: true, slug: true } },
        _count: { select: { progress: true } },
      },
    });

    return NextResponse.json({ success: true, data: lessons });
  } catch (error) {
    console.error("Get lessons error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// Create a lesson
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = lessonSchema.parse(body);

    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check for duplicate slug within the same learning path
    const existing = await prisma.lesson.findFirst({
      where: { learningPathId: data.learningPathId, slug },
    });
    if (existing) {
      return NextResponse.json({ success: false, error: "A lesson with similar title exists in this path" }, { status: 409 });
    }

    const maxOrder = await prisma.lesson.aggregate({
      where: { learningPathId: data.learningPathId },
      _max: { sortOrder: true },
    });

    const lesson = await prisma.lesson.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        content: data.content,
        contentType: data.contentType,
        difficulty: data.difficulty,
        durationMin: data.durationMin,
        points: data.points,
        xpReward: data.xpReward,
        sortOrder: (maxOrder._max.sortOrder || 0) + 1,
        learningPathId: data.learningPathId,
      },
    });

    return NextResponse.json({ success: true, data: lesson }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error("Create lesson error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// Delete a lesson
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }

    await prisma.lesson.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Lesson deleted" });
  } catch (error) {
    console.error("Delete lesson error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
