"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Target,
  Zap,
  Play,
  CheckCircle,
  Lock,
} from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  contentType: string;
  difficulty: string;
  durationMin: number;
  points: number;
  xpReward: number;
  sortOrder: number;
}

interface LearningPathDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  color: string;
  difficulty: string;
  lessons: Lesson[];
}

interface LessonProgress {
  lessonId: string;
  status: string;
  score: number;
  completedAt: string | null;
}

const contentTypeIcons: Record<string, string> = {
  TEXT: "📄",
  VIDEO: "🎬",
  INTERACTIVE: "🎮",
  QUIZ: "❓",
  PRACTICAL: "🔧",
};

export default function LearningPathDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [path, setPath] = useState<LearningPathDetail | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/learning-paths/${params.slug}`)
      .then((r) => r.json())
      .then((pathData) => {
        if (pathData.success) {
          setPath(pathData.data);
          if (session?.user?.id && pathData.data?.id) {
            fetch(`/api/lessons/progress?learningPathId=${pathData.data.id}`, {
                credentials: "include",
              })
              .then((r) => r.json())
              .then((progressData) => {
                if (progressData.success) setProgress(progressData.data);
              });
          }
        }
      })
      .finally(() => setLoading(false));
  }, [params.slug, session?.user?.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-secondary animate-pulse rounded" />
        <div className="h-32 bg-secondary animate-pulse rounded-xl" />
        <div className="grid gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-secondary animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Learning path not found</h2>
        <Link href="/learning-paths" className="text-primary hover:underline mt-4 inline-block">
          Back to Learning Paths
        </Link>
      </div>
    );
  }

  const completedCount = progress.filter((p) => p.status === "SOLVED").length;
  const progressPercent = path.lessons.length > 0 ? (completedCount / path.lessons.length) * 100 : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/learning-paths"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Learning Paths
      </Link>

      {/* Path header */}
      <Card className="glass-strong">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
              style={{ backgroundColor: `${path.color}15` }}
            >
              {path.icon || "📚"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{path.title}</h1>
              <p className="text-muted-foreground mb-4">{path.description}</p>
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  style={{
                    borderColor: `${getDifficultyColor(path.difficulty)}40`,
                    color: getDifficultyColor(path.difficulty),
                  }}
                >
                  {path.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {path.lessons.length} lessons · {path.lessons.reduce((acc, l) => acc + l.durationMin, 0)} min total
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completedCount}/{path.lessons.length} lessons</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Lessons list */}
      <div className="space-y-3">
        {path.lessons.map((lesson, index) => {
          const lessonProgress = progress.find((p) => p.lessonId === lesson.id);
          const isCompleted = lessonProgress?.status === "SOLVED";
          const isInProgress = lessonProgress?.status === "IN_PROGRESS";

          return (
            <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
              <Card className="glass card-hover group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                        {lesson.title}
                      </h3>
                      <span className="text-sm">{contentTypeIcons[lesson.contentType] || "📄"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {lesson.durationMin}m
                      </div>
                      <div className="flex items-center gap-1 text-xs text-cyan-400">
                        <Zap className="h-3 w-3" />
                        {lesson.xpReward} XP
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs shrink-0"
                      style={{
                        borderColor: `${getDifficultyColor(lesson.difficulty)}40`,
                        color: getDifficultyColor(lesson.difficulty),
                      }}
                    >
                      {lesson.difficulty}
                    </Badge>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
                    ) : (
                      <Play className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
