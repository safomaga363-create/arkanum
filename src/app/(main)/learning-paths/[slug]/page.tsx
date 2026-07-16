"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Target,
  Zap,
  Clock,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";

interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  category: string;
  points: number;
  xpReward: number;
  timeLimitMin: number | null;
  isFree: boolean;
  entryFee: number;
}

interface LearningPathDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  color: string;
  difficulty: string;
  challenges: Challenge[];
}

export default function LearningPathDetailPage() {
  const params = useParams();
  const [path, setPath] = useState<LearningPathDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch challenges filtered by learning path
    fetch(`/api/challenges?learningPathId=${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.items.length > 0) {
          // Build path from first challenge's learning path data
          const firstChallenge = data.data.items[0];
          setPath({
            id: params.slug as string,
            title: firstChallenge.learningPathId || "Learning Path",
            slug: params.slug as string,
            description: "",
            icon: null,
            color: "#00f0ff",
            difficulty: "MEDIUM",
            challenges: data.data.items,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-secondary animate-pulse rounded" />
        <div className="h-32 bg-secondary animate-pulse rounded-xl" />
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-secondary animate-pulse rounded-xl" />
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

  const solvedCount = 0; // Would come from progress API
  const progress = path.challenges.length > 0 ? (solvedCount / path.challenges.length) * 100 : 0;

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
                <Badge variant="outline" style={{ borderColor: `${getDifficultyColor(path.difficulty)}40`, color: getDifficultyColor(path.difficulty) }}>
                  {path.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {path.challenges.length} challenges
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{solvedCount}/{path.challenges.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Challenges list */}
      <div className="space-y-3">
        {path.challenges.map((challenge, index) => (
          <Link key={challenge.id} href={`/challenges/${challenge.slug}`}>
            <Card className="glass card-hover group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                      {challenge.title}
                    </h3>
                    {!challenge.isFree && (
                      <Badge variant="warning" className="text-xs shrink-0">
                        <Lock className="w-2 h-2 mr-1" />
                        ${challenge.entryFee}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {challenge.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-1 text-xs">
                      <Target className="h-3 w-3" />
                      {challenge.points}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-cyan-400">
                      <Zap className="h-3 w-3" />
                      {challenge.xpReward} XP
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs shrink-0"
                    style={{
                      borderColor: `${getDifficultyColor(challenge.difficulty)}40`,
                      color: getDifficultyColor(challenge.difficulty),
                    }}
                  >
                    {challenge.difficulty}
                  </Badge>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
