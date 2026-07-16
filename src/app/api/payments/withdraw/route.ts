import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

// Request withdrawal
const withdrawalSchema = z.object({
  amount: z.number().min(10),
  wallet: z.string().min(10),
  network: z.enum(["TRC20", "ERC20", "BEP20"]).default("TRC20"),
  notes: z.string().optional(),
});

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
    const data = withdrawalSchema.parse(body);
    const userId = session.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (data.amount < 10) {
      return NextResponse.json(
        { success: false, error: "Minimum withdrawal is $10 USDT" },
        { status: 400 }
      );
    }

    if (user.balance < data.amount) {
      return NextResponse.json(
        { success: false, error: "Insufficient balance" },
        { status: 400 }
      );
    }

    const fee = data.amount * 0.01;
    const netAmount = data.amount - fee;

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId,
        amount: data.amount,
        fee,
        netAmount,
        currency: "USDT",
        network: data.network,
        wallet: data.wallet,
        status: "PENDING",
        notes: data.notes,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: data.amount } },
    });

    return NextResponse.json(
      {
        success: true,
        data: withdrawal,
        message: `Withdrawal of ${netAmount} USDT (after $${fee.toFixed(2)} fee) requested. Processing within 24 hours.`,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Withdrawal error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get withdrawal history
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, data: withdrawals });
  } catch (error) {
    console.error("Get withdrawals error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
