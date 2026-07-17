import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      newUsersToday,
      newUsersWeek,
      activeContests,
      totalContests,
      completedContests,
      totalRevenue,
      pendingWithdrawals,
      recentPayments,
      topPlayers,
      monthlyRevenue,
      premiumUsers,
      totalLessons,
      lessonsCompleted,
      totalLearningPaths,
      pendingDeposits,
      totalDeposited,
      totalWithdrawn,
      totalContestEntries,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      // Active users (logged in within 7 days) - use updatedAt as proxy
      prisma.user.count({ where: { updatedAt: { gte: sevenDaysAgo } } }),
      // New users today
      prisma.user.count({ where: { createdAt: { gte: new Date(now.toISOString().split("T")[0]) } } }),
      // New users this week
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      // Active contests
      prisma.contest.count({ where: { status: "ACTIVE" } }),
      // Total contests
      prisma.contest.count(),
      // Completed contests
      prisma.contest.count({ where: { status: "FINISHED" } }),
      // Total revenue (completed payments)
      prisma.payment.aggregate({
        where: { status: "COMPLETED", type: { in: ["CONTEST_ENTRY", "PREMIUM_SUBSCRIPTION"] } },
        _sum: { amount: true },
      }),
      // Pending withdrawals
      prisma.withdrawal.count({ where: { status: "PENDING" } }),
      // Recent payments
      prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { username: true } } },
      }),
      // Top players
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
      // Monthly revenue
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: { amount: true },
      }),
      // Premium users
      prisma.user.count({ where: { isPremium: true } }),
      // Total lessons
      prisma.lesson.count({ where: { isPublished: true } }),
      // Lessons completed
      prisma.lessonProgress.count({ where: { status: "SOLVED" } }),
      // Total learning paths
      prisma.learningPath.count({ where: { isPublished: true } }),
      // Pending deposits
      prisma.payment.count({ where: { type: "DEPOSIT", status: "PENDING" } }),
      // Total deposited (completed)
      prisma.payment.aggregate({
        where: { type: "DEPOSIT", status: "COMPLETED" },
        _sum: { amount: true },
      }),
      // Total withdrawn
      prisma.withdrawal.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      // Total contest entries
      prisma.contestEntry.count(),
    ]);

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

    // Revenue by day (last 30 days) for chart data
    const dailyRevenue = await prisma.$queryRaw<{ date: string; amount: number }[]>`
      SELECT 
        DATE(created_at) as date,
        SUM(amount) as amount
      FROM payments
      WHERE status = 'COMPLETED' 
        AND created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    // Registration trend (last 30 days)
    const dailyRegistrations = await prisma.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    return NextResponse.json({
      success: true,
      data: {
        // Core stats
        totalUsers,
        activeUsers,
        newUsersToday,
        newUsersWeek,
        activeContests,
        totalContests,
        completedContests,
        totalRevenue: totalRevenue._sum.amount || 0,
        platformEarnings,
        pendingWithdrawals,
        pendingDeposits,
        premiumUsers,

        // Financial
        totalDeposited: totalDeposited._sum.amount || 0,
        totalWithdrawn: totalWithdrawn._sum.amount || 0,

        // Learning
        totalLessons,
        lessonsCompleted,
        totalLearningPaths,
        totalContestEntries,

        // Time-based
        monthlyRevenue: monthlyRevenue._sum.amount || 0,

        // Charts
        dailyRevenue: dailyRevenue.map((r) => ({
          date: String(r.date),
          amount: Number(r.amount),
        })),
        dailyRegistrations: dailyRegistrations.map((r) => ({
          date: String(r.date),
          count: Number(r.count),
        })),

        // Lists
        recentPayments: recentPayments.map((p) => ({
          ...p,
          username: p.user.username,
        })),
        topPlayers,
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
