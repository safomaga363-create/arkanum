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
  Zap,
  Target,
  Clock,
  Lock,
  ArrowLeft,
  Lightbulb,
  Terminal,
  CheckCircle,
  Play,
} from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";

interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  hints: string | null;
  difficulty: string;
  category: string;
  points: number;
  xpReward: number;
  timeLimitMin: number | null;
  maxAttempts: number | null;
  isFree: boolean;
  entryFee: number;
  learningPath: {
    id: string;
    title: string;
    slug: string;
    color: string;
  } | null;
}

interface Progress {
  status: string;
  score: number;
  attempts: number;
  solvedAt: string | null;
}

export default function ChallengeDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/challenges/${params.id}`).then((res) => res.json()),
      session?.user?.id
        ? fetch(`/api/challenges/progress?challengeId=${params.id}`).then((res) => res.json())
        : Promise.resolve({ success: false }),
    ]).then(([challengeData, progressData]) => {
      if (challengeData.success) setChallenge(challengeData.data);
      if (progressData.success && progressData.data) setProgress(progressData.data);
    }).finally(() => setLoading(false));
  }, [params.id, session?.user?.id]);

  const hints: string[] = challenge?.hints ? JSON.parse(challenge.hints) : [];

  async function handleStart() {
    if (!session?.user?.id) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/challenges/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: challenge!.id, action: "start" }),
      });
      const data = await res.json();
      if (data.success) {
        setProgress(data.data);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit() {
    if (!session?.user?.id || !challenge) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/challenges/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: challenge.id,
          action: "submit",
          score: 100,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProgress(data.data);
        window.location.reload();
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="h-6 w-32 bg-secondary animate-pulse rounded" />
        <div className="h-12 bg-secondary animate-pulse rounded" />
        <div className="h-64 bg-secondary animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Challenge not found</h2>
        <Link href="/challenges" className="text-primary hover:underline mt-4 inline-block">
          Back to Challenges
        </Link>
      </div>
    );
  }

  const isSolved = progress?.status === "SOLVED";

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/challenges"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Challenges
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge
            variant="outline"
            style={{
              borderColor: `${getDifficultyColor(challenge.difficulty)}40`,
              color: getDifficultyColor(challenge.difficulty),
            }}
          >
            {challenge.difficulty}
          </Badge>
          <Badge variant="secondary">{challenge.category}</Badge>
          {challenge.isFree && <Badge variant="neon">Free</Badge>}
          {isSolved && (
            <Badge variant="success">
              <CheckCircle className="w-3 h-3 mr-1" />
              Solved
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold">{challenge.title}</h1>
        {challenge.learningPath && (
          <p className="text-sm text-muted-foreground mt-1">
            in{" "}
            <Link href={`/learning-paths/${challenge.learningPath.slug}`} className="text-primary hover:underline">
              {challenge.learningPath.title}
            </Link>
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass">
            <CardContent className="p-6">
              <div className="text-sm leading-relaxed whitespace-pre-line">
                {challenge.content || challenge.description}
              </div>
            </CardContent>
          </Card>

          {/* Hints */}
          {hints.length > 0 && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-400" />
                  Hints
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showHints ? (
                  <Button variant="outline" onClick={() => setShowHints(true)}>
                    <Lock className="h-4 w-4 mr-2" />
                    Reveal Hints (-10 XP penalty)
                  </Button>
                ) : (
                  <div className="space-y-3">
                    {hints.slice(0, currentHint + 1).map((hint, i) => (
                      <div key={i} className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                        <p className="text-sm">
                          <span className="font-medium text-yellow-400">Hint {i + 1}:</span>{" "}
                          {hint}
                        </p>
                      </div>
                    ))}
                    {currentHint < hints.length - 1 && (
                      <Button variant="ghost" size="sm" onClick={() => setCurrentHint(currentHint + 1)}>
                        Show next hint
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Challenge info */}
          <Card className="glass-strong">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <Target className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold">{challenge.points}</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
                <div className="text-center">
                  <Zap className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
                  <p className="text-lg font-bold">{challenge.xpReward}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </div>

              <Separator />

              {challenge.timeLimitMin && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Time limit: {challenge.timeLimitMin} minutes</span>
                </div>
              )}

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
              ) : isSolved ? (
                <Button className="w-full" size="lg" variant="outline" disabled>
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  Challenge Solved!
                </Button>
              ) : progress?.status === "IN_PROGRESS" ? (
                <Button className="w-full" size="lg" onClick={handleSubmit} disabled={submitting}>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Submit Solution
                </Button>
              ) : (
                <Button className="w-full" size="lg" onClick={handleStart} disabled={submitting}>
                  <Play className="h-5 w-5 mr-2" />
                  Start Challenge
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Terminal placeholder */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Terminal className="h-4 w-4 text-green-400" />
                Sandbox Terminal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                <p className="text-green-400">$ {progress?.status === "IN_PROGRESS" ? "Challenge active" : "Start the challenge to"}</p>
                <p className="text-green-400">{progress?.status === "IN_PROGRESS" ? "Solve the challenge and submit" : "access the sandbox environment"}</p>
                <p className="text-muted-foreground mt-2">_</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
