import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const progressSchema = z.object({
  challengeId: z.string(),
  action: z.enum(["start", "submit", "skip"]),
  score: z.number().optional(),
});

// Get user's challenge progress
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

    if (!challengeId) {
      return NextResponse.json(
        { success: false, error: "challengeId required" },
        { status: 400 }
      );
    }

    const progress = await prisma.challengeProgress.findUnique({
      where: {
        userId_challengeId: {
          userId: session.user.id,
          challengeId,
        },
      },
    });

    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error("Get challenge progress error:", error);
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
          completedAt: new Date(),
        },
        update: {
          status: "SOLVED",
          score,
          completedAt: new Date(),
        },
      });

      // Award XP
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true, isPremium: true },
      });

      const xpMultiplier = user?.isPremium ? 2 : 1;
      const xpReward = challenge.xpReward * xpMultiplier;

      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: xpReward },
        },
      });

      // Recalculate level and rank
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true },
      });

      if (updatedUser) {
        const newLevel = Math.floor(updatedUser.xp / 500) + 1;
        let newRank: string = "BRONZE";
        if (updatedUser.xp >= 250000) newRank = "LEGENDARY";
        else if (updatedUser.xp >= 100000) newRank = "MASTER";
        else if (updatedUser.xp >= 50000) newRank = "DIAMOND";
        else if (updatedUser.xp >= 15000) newRank = "PLATINUM";
        else if (updatedUser.xp >= 5000) newRank = "GOLD";
        else if (updatedUser.xp >= 1000) newRank = "SILVER";

        await prisma.user.update({
          where: { id: userId },
          data: { level: newLevel, rank: newRank as any },
        });
      }

      return NextResponse.json({
        success: true,
        data: progress,
        message: `Challenge solved! +${xpReward} XP${xpMultiplier > 1 ? " (2x Premium bonus!)" : ""}`,
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
    console.error("Challenge progress error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
