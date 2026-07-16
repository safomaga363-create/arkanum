import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const progressSchema = z.object({
  challengeId: z.string(),
  action: z.enum(["start", "submit", "skip"]),
  score: z.number().optional(),
});

// Get user's progress for a challenge
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
    const challengeId = searchParams.get("challengeId");

    if (challengeId) {
      const progress = await prisma.challengeProgress.findUnique({
        where: {
          userId_challengeId: {
            userId: session.user.id,
            challengeId,
          },
        },
      });
      return NextResponse.json({ success: true, data: progress });
    }

    // Get all user progress
    const allProgress = await prisma.challengeProgress.findMany({
      where: { userId: session.user.id },
      include: {
        challenge: {
          select: { id: true, title: true, slug: true, difficulty: true, points: true, xpReward: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, data: allProgress });
  } catch (error) {
    console.error("Get progress error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Start, submit, or skip a challenge
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

    // Verify challenge exists
    const challenge = await prisma.challenge.findUnique({
      where: { id: data.challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { success: false, error: "Challenge not found" },
        { status: 404 }
      );
    }

    const userId = session.user.id;

    if (data.action === "start") {
      // Create or update progress to IN_PROGRESS
      const progress = await prisma.challengeProgress.upsert({
        where: {
          userId_challengeId: {
            userId,
            challengeId: data.challengeId,
          },
        },
        create: {
          userId,
          challengeId: data.challengeId,
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

    if (data.action === "submit") {
      const score = data.score || 100;

      // Update progress to SOLVED
      const progress = await prisma.challengeProgress.upsert({
        where: {
          userId_challengeId: {
            userId,
            challengeId: data.challengeId,
          },
        },
        create: {
          userId,
          challengeId: data.challengeId,
          status: "SOLVED",
          score,
          attempts: 1,
          solvedAt: new Date(),
        },
        update: {
          status: "SOLVED",
          score,
          solvedAt: new Date(),
        },
      });

      // Award XP to user
      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: challenge.xpReward },
        },
      });

      // Calculate new level (every 500 XP = 1 level)
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
        message: `Challenge solved! +${challenge.xpReward} XP`,
      });
    }

    if (data.action === "skip") {
      const progress = await prisma.challengeProgress.upsert({
        where: {
          userId_challengeId: {
            userId,
            challengeId: data.challengeId,
          },
        },
        create: {
          userId,
          challengeId: data.challengeId,
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

    console.error("Progress error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
