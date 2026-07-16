"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ArrowRight,
  Zap,
  Target,
} from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";

interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  color: string;
  difficulty: string;
  _count: { challenges: number };
}

export default function LearningPathsPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learning-paths")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPaths(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="neon-text">Learning Paths</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Structured courses from beginner to expert. Master each domain step by step.
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass animate-pulse">
              <CardContent className="p-6 h-48" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path) => (
            <Link key={path.id} href={`/learning-paths/${path.slug}`}>
              <Card className="glass card-hover h-full group">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${path.color}15` }}
                    >
                      {path.icon || "📚"}
                    </div>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: `${getDifficultyColor(path.difficulty)}40`,
                        color: getDifficultyColor(path.difficulty),
                      }}
                    >
                      {path.difficulty}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
                    {path.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {path._count.lessons} lessons
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Start
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!loading && paths.length === 0 && (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Learning Paths Yet</h3>
            <p className="text-muted-foreground">
              Learning paths will appear here once created by the admin.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
