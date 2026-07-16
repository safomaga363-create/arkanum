import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const depositSchema = z.object({
  amount: z.number().min(1),
  txHash: z.string().min(10),
  network: z.enum(["TRC20", "ERC20", "BEP20"]).default("TRC20"),
});

// Request deposit (user sends USDT, provides tx hash)
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
    const data = depositSchema.parse(body);

    // Check for duplicate tx hash
    const existing = await prisma.payment.findFirst({
      where: { txHash: data.txHash },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "This transaction has already been submitted" },
        { status: 400 }
      );
    }

    // Create deposit payment (pending admin verification)
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: data.amount,
        currency: "USDT",
        network: data.network,
        type: "DEPOSIT",
        status: "PENDING",
        txHash: data.txHash,
        description: `Deposit of ${data.amount} USDT via ${data.network}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: payment,
      message: `Deposit of ${data.amount} USDT submitted. Waiting for confirmation (usually within 1 hour).`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Deposit error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
