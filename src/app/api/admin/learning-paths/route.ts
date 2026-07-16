import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const learningPathSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  icon: z.string().optional(),
  color: z.string().default("#00f0ff"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT", "LEGENDARY"]),
});

// List all learning paths
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const paths = await prisma.learningPath.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { challenges: true } },
      },
    });

    return NextResponse.json({ success: true, data: paths });
  } catch (error) {
    console.error("Get learning paths error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// Create a learning path
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = learningPathSchema.parse(body);

    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await prisma.learningPath.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: "A learning path with similar title exists" }, { status: 409 });
    }

    const maxOrder = await prisma.learningPath.aggregate({ _max: { sortOrder: true } });

    const path = await prisma.learningPath.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        icon: data.icon,
        color: data.color,
        difficulty: data.difficulty,
        sortOrder: (maxOrder._max.sortOrder || 0) + 1,
      },
    });

    return NextResponse.json({ success: true, data: path }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error("Create learning path error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// Delete a learning path
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }

    await prisma.learningPath.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Learning path deleted" });
  } catch (error) {
    console.error("Delete learning path error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
