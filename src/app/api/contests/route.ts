import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createContestSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  rules: z.string().optional(),
  entryFee: z.number().min(0),
  prizePool: z.number().min(0),
  commission: z.number().min(5).max(50).default(20),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT", "LEGENDARY"]),
  maxParticipants: z.number().min(2).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  duration: z.number().min(10).max(1440).default(120),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");

    const where: any = {};
    if (status) where.status = status;

    const [contests, total] = await Promise.all([
      prisma.contest.findMany({
        where,
        orderBy: { startDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.contest.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: contests,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Get contests error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createContestSchema.parse(body);

    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check unique slug
    const existing = await prisma.contest.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A contest with a similar title already exists" },
        { status: 409 }
      );
    }

    // Calculate prize pool from entry fees if not provided
    const calculatedPrizePool = data.prizePool || 
      (data.entryFee * (data.maxParticipants || 100) * (1 - data.commission / 100));

    const contest = await prisma.contest.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        rules: data.rules,
        entryFee: data.entryFee,
        prizePool: calculatedPrizePool,
        commission: data.commission,
        difficulty: data.difficulty,
        maxParticipants: data.maxParticipants,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        duration: data.duration,
        status: new Date(data.startDate) > new Date() ? "UPCOMING" : "ACTIVE",
      },
    });

    return NextResponse.json(
      { success: true, data: contest },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Create contest error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
