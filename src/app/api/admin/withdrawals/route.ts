import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

// List pending withdrawals
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status) where.status = status;

    const withdrawals = await prisma.withdrawal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
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

// Approve or reject a withdrawal
const approveSchema = z.object({
  withdrawalId: z.string(),
  action: z.enum(["approve", "reject"]),
  txHash: z.string().optional(),
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

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: data.withdrawalId },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { success: false, error: "Withdrawal not found" },
        { status: 404 }
      );
    }

    if (withdrawal.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: "Withdrawal already processed" },
        { status: 400 }
      );
    }

    if (data.action === "approve") {
      await prisma.withdrawal.update({
        where: { id: data.withdrawalId },
        data: {
          status: "COMPLETED",
          txHash: data.txHash,
          notes: data.notes,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Withdrawal approved and marked as completed",
      });
    } else {
      // Reject — refund balance
      await prisma.user.update({
        where: { id: withdrawal.userId },
        data: { balance: { increment: withdrawal.amount } },
      });

      await prisma.withdrawal.update({
        where: { id: data.withdrawalId },
        data: {
          status: "REJECTED",
          notes: data.notes || "Rejected by admin",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Withdrawal rejected, balance refunded",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Process withdrawal error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
