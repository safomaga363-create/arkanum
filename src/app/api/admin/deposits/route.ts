import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

// List pending deposits
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const deposits = await prisma.payment.findMany({
      where: { type: "DEPOSIT" },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: deposits });
  } catch (error) {
    console.error("Get deposits error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Approve or reject a deposit
const approveSchema = z.object({
  paymentId: z.string(),
  action: z.enum(["approve", "reject"]),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const data = approveSchema.parse(body);

    const payment = await prisma.payment.findUnique({
      where: { id: data.paymentId },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    if (payment.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: "Payment already processed" },
        { status: 400 }
      );
    }

    if (data.action === "approve") {
      // Credit user balance
      await prisma.user.update({
        where: { id: payment.userId },
        data: { balance: { increment: payment.amount } },
      });

      await prisma.payment.update({
        where: { id: data.paymentId },
        data: {
          status: "COMPLETED",
          notes: data.notes,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Deposit approved. $${payment.amount} credited to user.`,
      });
    } else {
      await prisma.payment.update({
        where: { id: data.paymentId },
        data: {
          status: "REFUNDED",
          notes: data.notes || "Rejected by admin",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Deposit rejected",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Process deposit error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
