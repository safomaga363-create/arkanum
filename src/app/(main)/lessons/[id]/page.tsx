"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Zap,
  CheckCircle,
  Play,
  FileText,
  Video,
  Gamepad2,
  HelpCircle,
  Wrench,
  Loader2,
} from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  contentType: string;
  difficulty: string;
  durationMin: number;
  points: number;
  xpReward: number;
  sortOrder: number;
  learningPath: {
    id: string;
    title: string;
    slug: string;
    color: string;
  };
  prevLesson: { id: string; title: string; slug: string } | null;
  nextLesson: { id: string; title: string; slug: string } | null;
}

interface LessonProgress {
  status: string;
  score: number;
  attempts: number;
  completedAt: string | null;
}

const contentTypeConfig: Record<string, { icon: React.ReactNode; label: string }> = {
  TEXT: { icon: <FileText className="h-5 w-5" />, label: "Reading" },
  VIDEO: { icon: <Video className="h-5 w-5" />, label: "Video" },
  INTERACTIVE: { icon: <Gamepad2 className="h-5 w-5" />, label: "Interactive" },
  QUIZ: { icon: <HelpCircle className="h-5 w-5" />, label: "Quiz" },
  PRACTICAL: { icon: <Wrench className="h-5 w-5" />, label: "Hands-on Lab" },
};

export default function LessonDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/lessons/${params.id}`).then((r) => r.json()),
      session?.user?.id
        ? fetch(`/api/lessons/progress?lessonId=${params.id}`).then((r) => r.json())
        : Promise.resolve({ success: false }),
    ]).then(([lessonData, progressData]) => {
      if (lessonData.success) setLesson(lessonData.data);
      if (progressData.success && progressData.data) setProgress(progressData.data);
    }).finally(() => setLoading(false));
  }, [params.id, session?.user?.id]);

  async function handleStart() {
    if (!session?.user?.id || !lesson) return;
    try {
      const res = await fetch("/api/lessons/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, action: "start" }),
      });
      const data = await res.json();
      if (data.success) setProgress(data.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleComplete() {
    if (!session?.user?.id || !lesson) return;
    setCompleting(true);
    try {
      const res = await fetch("/api/lessons/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, action: "complete", score: 100 }),
      });
      const data = await res.json();
      if (data.success) {
        setProgress(data.data);
        window.location.reload();
      }
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="h-6 w-32 bg-secondary animate-pulse rounded" />
        <div className="h-12 bg-secondary animate-pulse rounded" />
        <div className="h-96 bg-secondary animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Lesson not found</h2>
        <Link href="/learning-paths" className="text-primary hover:underline mt-4 inline-block">
          Back to Learning Paths
        </Link>
      </div>
    );
  }

  const isCompleted = progress?.status === "SOLVED";
  const contentType = contentTypeConfig[lesson.contentType] || contentTypeConfig.TEXT;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href={`/learning-paths/${lesson.learningPath.slug}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {lesson.learningPath.title}
        </Link>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge
            variant="outline"
            style={{
              borderColor: `${getDifficultyColor(lesson.difficulty)}40`,
              color: getDifficultyColor(lesson.difficulty),
            }}
          >
            {lesson.difficulty}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            {contentType.icon}
            {contentType.label}
          </Badge>
          {isCompleted && (
            <Badge variant="success">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <p className="text-muted-foreground mt-2">{lesson.description}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass">
            <CardContent className="p-6">
              <div className="text-sm leading-relaxed whitespace-pre-line prose prose-invert max-w-none">
                {lesson.content || "No content available for this lesson."}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lesson info */}
          <Card className="glass-strong">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <Target className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold">{lesson.points}</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
                <div className="text-center">
                  <Zap className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
                  <p className="text-lg font-bold">{lesson.xpReward}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Estimated: {lesson.durationMin} minutes</span>
              </div>

              {progress && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Attempts: {progress.attempts}</span>
                </div>
              )}

              {!session?.user?.id ? (
                <Link href="/login">
                  <Button className="w-full" size="lg">
                    Sign in to Start
                  </Button>
                </Link>
              ) : isCompleted ? (
                <Button className="w-full" size="lg" variant="outline" disabled>
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  Lesson Completed!
                </Button>
              ) : progress?.status === "IN_PROGRESS" ? (
                <Button className="w-full" size="lg" onClick={handleComplete} disabled={completing}>
                  {completing ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  )}
                  Mark as Complete
                </Button>
              ) : (
                <Button className="w-full" size="lg" onClick={handleStart}>
                  <Play className="h-5 w-5 mr-2" />
                  Start Lesson
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card className="glass">
            <CardContent className="p-4 space-y-2">
              {lesson.prevLesson ? (
                <Link href={`/lessons/${lesson.prevLesson.id}`}>
                  <Button variant="ghost" className="w-full justify-start">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {lesson.prevLesson.title}
                  </Button>
                </Link>
              ) : (
                <div className="h-10" />
              )}
              {lesson.nextLesson ? (
                <Link href={`/lessons/${lesson.nextLesson.id}`}>
                  <Button variant="ghost" className="w-full justify-end">
                    {lesson.nextLesson.title}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <div className="h-10" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
