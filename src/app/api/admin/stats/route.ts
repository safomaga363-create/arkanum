import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Owner dashboard stats
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [
      totalUsers,
      activeContests,
      totalRevenue,
      pendingWithdrawals,
      recentPayments,
      topPlayers,
      monthlyRevenue,
      premiumUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.contest.count({ where: { status: "ACTIVE" } }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED", type: { in: ["CONTEST_ENTRY", "PREMIUM_SUBSCRIPTION"] } },
        _sum: { amount: true },
      }),
      prisma.withdrawal.count({ where: { status: "PENDING" } }),
      prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { username: true } } },
      }),
      prisma.user.findMany({
        orderBy: { xp: "desc" },
        take: 10,
        select: {
          id: true,
          username: true,
          xp: true,
          level: true,
          rank: true,
          balance: true,
          totalEarned: true,
        },
      }),
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
        },
        _sum: { amount: true },
      }),
      prisma.user.count({ where: { isPremium: true } }),
    ]);

    // Calculate commission earned (20% of contest entries + 100% of premium)
    const commissionRate = parseFloat(process.env.PLATFORM_COMMISSION_PERCENT || "20") / 100;
    const contestRevenue = await prisma.payment.aggregate({
      where: { status: "COMPLETED", type: "CONTEST_ENTRY" },
      _sum: { amount: true },
    });
    const premiumRevenue = await prisma.payment.aggregate({
      where: { status: "COMPLETED", type: "PREMIUM_SUBSCRIPTION" },
      _sum: { amount: true },
    });

    const platformEarnings =
      (contestRevenue._sum.amount || 0) * commissionRate +
      (premiumRevenue._sum.amount || 0);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeContests,
        totalRevenue: totalRevenue._sum.amount || 0,
        platformEarnings,
        pendingWithdrawals,
        recentPayments: recentPayments.map((p) => ({
          ...p,
          username: p.user.username,
        })),
        topPlayers,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        premiumUsers,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
