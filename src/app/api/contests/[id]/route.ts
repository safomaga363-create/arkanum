import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const contest = await prisma.contest.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        entries: {
          orderBy: { score: "desc" },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
                xp: true,
                level: true,
                rank: true,
              },
            },
          },
        },
        _count: {
          select: { entries: true },
        },
      },
    });

    if (!contest) {
      return NextResponse.json(
        { success: false, error: "Contest not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contest });
  } catch (error) {
    console.error("Get contest error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
