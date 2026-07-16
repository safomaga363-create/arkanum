import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const subscribeSchema = z.object({
  plan: z.enum(["monthly", "quarterly", "annual"]),
});

const plans = {
  monthly: { amount: 29.99, months: 1, label: "1 Month" },
  quarterly: { amount: 74.99, months: 3, label: "3 Months" },
  annual: { amount: 249.99, months: 12, label: "1 Year" },
};

// Subscribe to premium
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
    const data = subscribeSchema.parse(body);
    const plan = plans[data.plan];

    // Check if already premium
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPremium: true, premiumExpiry: true, balance: true },
    });

    if (user?.isPremium && user.premiumExpiry && new Date(user.premiumExpiry) > new Date()) {
      return NextResponse.json(
        { success: false, error: "You already have an active premium subscription" },
        { status: 400 }
      );
    }

    // Check balance
    if (!user || user.balance < plan.amount) {
      return NextResponse.json(
        { success: false, error: `Insufficient balance. Need $${plan.amount}, have $${user?.balance || 0}` },
        { status: 400 }
      );
    }

    // Calculate expiry
    const startsAt = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + plan.months);

    // Create premium transaction
    const transaction = await prisma.premiumTransaction.create({
      data: {
        userId: session.user.id,
        amount: plan.amount,
        currency: "USDT",
        period: data.plan,
        status: "COMPLETED",
        startsAt,
        expiresAt,
      },
    });

    // Deduct from balance and activate premium
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        balance: { decrement: plan.amount },
        totalSpent: { increment: plan.amount },
        isPremium: true,
        premiumExpiry: expiresAt,
      },
    });

    // Record payment
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: plan.amount,
        currency: "USDT",
        network: "TRC20",
        type: "PREMIUM_SUBSCRIPTION",
        status: "COMPLETED",
        description: `Premium subscription: ${plan.label}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: transaction,
      message: `Premium activated! Valid until ${expiresAt.toLocaleDateString()}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Premium subscribe error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get premium status
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPremium: true, premiumExpiry: true },
    });

    const transactions = await prisma.premiumTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      data: {
        isPremium: user?.isPremium || false,
        expiry: user?.premiumExpiry,
        transactions,
      },
    });
  } catch (error) {
    console.error("Get premium status error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
