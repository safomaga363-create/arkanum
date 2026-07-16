import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const challengeSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  content: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT", "LEGENDARY"]),
  category: z.string().min(1),
  points: z.number().min(1),
  xpReward: z.number().min(1),
  timeLimitMin: z.number().optional(),
  entryFee: z.number().default(0),
  learningPathId: z.string().optional(),
});

// List all challenges
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const challenges = await prisma.challenge.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        learningPath: { select: { title: true } },
        _count: { select: { progress: true } },
      },
    });

    return NextResponse.json({ success: true, data: challenges });
  } catch (error) {
    console.error("Get challenges error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// Create a challenge
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = challengeSchema.parse(body);

    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await prisma.challenge.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: "A challenge with similar title exists" }, { status: 409 });
    }

    const challenge = await prisma.challenge.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        content: data.content,
        difficulty: data.difficulty,
        category: data.category,
        points: data.points,
        xpReward: data.xpReward,
        timeLimitMin: data.timeLimitMin,
        entryFee: data.entryFee,
        isFree: data.entryFee === 0,
        learningPathId: data.learningPathId || null,
      },
    });

    return NextResponse.json({ success: true, data: challenge }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error("Create challenge error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// Delete a challenge
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

    await prisma.challenge.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Challenge deleted" });
  } catch (error) {
    console.error("Delete challenge error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
