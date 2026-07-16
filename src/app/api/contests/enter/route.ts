import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

// Enter a contest (pay entry fee)
const enterContestSchema = z.object({
  contestId: z.string(),
  paymentMethod: z.enum(["USDT_TRC20", "balance"]).default("USDT_TRC20"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = enterContestSchema.parse(body);

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    // Get contest
    const contest = await prisma.contest.findUnique({
      where: { id: data.contestId },
    });

    if (!contest) {
      return NextResponse.json(
        { success: false, error: "Contest not found" },
        { status: 404 }
      );
    }

    if (contest.status !== "ACTIVE" && contest.status !== "UPCOMING") {
      return NextResponse.json(
        { success: false, error: "Contest is not accepting entries" },
        { status: 400 }
      );
    }

    if (
      contest.maxParticipants &&
      contest.currentParticipants >= contest.maxParticipants
    ) {
      return NextResponse.json(
        { success: false, error: "Contest is full" },
        { status: 400 }
      );
    }

    // Check if already entered
    const existingEntry = await prisma.contestEntry.findUnique({
      where: {
        userId_contestId: {
          userId,
          contestId: data.contestId,
        },
      },
    });

    if (existingEntry) {
      return NextResponse.json(
        { success: false, error: "Already entered this contest" },
        { status: 400 }
      );
    }

    // Handle payment
    if (contest.entryFee > 0) {
      if (data.paymentMethod === "balance") {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.balance < contest.entryFee) {
          return NextResponse.json(
            { success: false, error: "Insufficient balance" },
            { status: 400 }
          );
        }

        // Deduct from balance
        await prisma.user.update({
          where: { id: userId },
          data: {
            balance: { decrement: contest.entryFee },
            totalSpent: { increment: contest.entryFee },
          },
        });
      } else {
        // USDT payment — create pending payment
        // In production: redirect to Cryptomus/NOWPayments
        const payment = await prisma.payment.create({
          data: {
            userId,
            amount: contest.entryFee,
            currency: "USDT",
            network: "TRC20",
            type: "CONTEST_ENTRY",
            status: "PENDING",
            contestId: data.contestId,
            description: `Entry fee for contest: ${contest.title}`,
          },
        });

        // For now, auto-complete (in production: wait for webhook)
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "COMPLETED" },
        });
      }
    }

    // Create entry
    const entry = await prisma.contestEntry.create({
      data: {
        userId,
        contestId: data.contestId,
        status: "ACTIVE",
      },
    });

    // Increment participant count
    await prisma.contest.update({
      where: { id: data.contestId },
      data: { currentParticipants: { increment: 1 } },
    });

    // Recalculate prize pool
    const newPrizePool = contest.entryFee * (contest.currentParticipants + 1) * (1 - contest.commission / 100);
    await prisma.contest.update({
      where: { id: data.contestId },
      data: { prizePool: newPrizePool },
    });

    return NextResponse.json(
      { success: true, data: entry, message: "Successfully entered contest" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Enter contest error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
