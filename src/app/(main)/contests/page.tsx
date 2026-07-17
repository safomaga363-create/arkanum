"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Swords,
  Clock,
  Users,
  Trophy,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

interface Contest {
  id: string;
  title: string;
  slug: string;
  description: string;
  prizePool: number;
  entryFee: number;
  commission: number;
  difficulty: string;
  maxParticipants: number | null;
  currentParticipants: number;
  status: string;
  startDate: string;
  endDate: string;
  duration: number;
  isFeatured: boolean;
}

const statusColors: Record<string, string> = {
  DRAFT: "secondary",
  UPCOMING: "warning",
  ACTIVE: "success",
  FINISHED: "secondary",
  CANCELLED: "destructive",
};

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { t } = useI18n();

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);

    fetch(`/api/contests?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setContests(data.data.items);
      })
      .finally(() => setLoading(false));
  }, [filter]);

  const featured = contests.find((c) => c.isFeatured);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="neon-text-purple">{t.contests.title}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.contests.subtitle}
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { key: "all", label: t.common.all },
            { key: "ACTIVE", label: t.contests.activeContests },
            { key: "UPCOMING", label: t.contests.upcomingContests },
            { key: "FINISHED", label: t.contests.pastContests },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass animate-pulse">
              <CardContent className="p-8 h-48" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Featured contest */}
          {featured && (
            <Card className="glass-strong neon-border-purple overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
              <CardContent className="p-8 relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge variant={statusColors[featured.status] as any} className="mb-2">
                      {featured.status}
                    </Badge>
                    <h2 className="text-2xl font-bold">{featured.title}</h2>
                    <p className="text-muted-foreground mt-1">{featured.description}</p>
                  </div>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: `${getDifficultyColor(featured.difficulty)}40`,
                      color: getDifficultyColor(featured.difficulty),
                    }}
                  >
                    {featured.difficulty}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <Trophy className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                    <p className="text-lg font-bold">${featured.prizePool.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">{t.contests.prizePool}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <Zap className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold">${featured.entryFee}</p>
                    <p className="text-xs text-muted-foreground">{t.contests.entryFee}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <Users className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                    <p className="text-lg font-bold">
                      {featured.currentParticipants}/{featured.maxParticipants || "\u221E"}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.contests.players}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <Clock className="h-5 w-5 text-green-400 mx-auto mb-1" />
                    <p className="text-lg font-bold">{featured.duration}{t.contests.minutes}</p>
                    <p className="text-xs text-muted-foreground">{t.contests.duration}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <Link href={`/contests/${featured.slug}`}>
                    <Button size="lg">
                      <Swords className="h-5 w-5 mr-2" />
                      {t.contests.viewContest}
                      <ArrowUpRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {featured.commission}% {t.contests.platformCommission}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All contests */}
          <div className="grid md:grid-cols-2 gap-4">
            {contests.map((contest) => (
              <Link key={contest.id} href={`/contests/${contest.slug}`}>
                <Card className="glass card-hover h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge variant={statusColors[contest.status] as any} className="mb-2 text-xs">
                          {contest.status}
                        </Badge>
                        <h3 className="font-semibold">{contest.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {contest.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-400" />
                        <span className="font-medium">${contest.prizePool.toFixed(0)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>${contest.entryFee} {t.contests.entryFee}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-purple-400" />
                        <span>
                          {contest.currentParticipants}/{contest.maxParticipants || "\u221E"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: `${getDifficultyColor(contest.difficulty)}40`,
                          color: getDifficultyColor(contest.difficulty),
                        }}
                      >
                        {contest.difficulty}
                      </Badge>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {contests.length === 0 && (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Swords className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t.contests.noContestsFound}</h3>
                <p className="text-muted-foreground">
                  {filter !== "all" ? t.contests.tryDifferentFilter : t.contests.contestsWillAppear}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
