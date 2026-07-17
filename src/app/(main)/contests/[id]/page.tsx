"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Trophy,
  Swords,
  Clock,
  Users,
  Zap,
  Shield,
  ArrowLeft,
  Info,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { getDifficultyColor, getRankColor } from "@/lib/utils";

interface Contest {
  id: string;
  title: string;
  slug: string;
  description: string;
  rules: string | null;
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
  prizes: string | null;
  entries: Array<{
    id: string;
    score: number;
    rank: number | null;
    prize: number;
    user: {
      id: string;
      username: string;
      displayName: string | null;
      avatar: string | null;
      xp: number;
      level: number;
      rank: string;
    };
  }>;
  _count: { entries: number };
}

const statusColors: Record<string, string> = {
  DRAFT: "secondary",
  UPCOMING: "warning",
  ACTIVE: "success",
  FINISHED: "secondary",
  CANCELLED: "destructive",
};

export default function ContestDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [entering, setEntering] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    fetch(`/api/contests/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setContest(data.data);
          // Check if user already entered
          if (session?.user?.id) {
            const userEntry = data.data.entries?.find(
              (e: any) => e.user.id === session.user.id
            );
            if (userEntry) setEntered(true);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [params.id, session?.user?.id]);

  async function handleEnter() {
    if (!contest) return;
    setEntering(true);
    try {
      const res = await fetch("/api/contests/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          contestId: contest.id,
          paymentMethod: "balance",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEntered(true);
        // Refresh contest data
        const refresh = await fetch(`/api/contests/${params.id}`);
        const refreshData = await refresh.json();
        if (refreshData.success) setContest(refreshData.data);
      } else {
        alert(data.error || "Failed to enter contest");
      }
    } finally {
      setEntering(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="h-6 w-32 bg-secondary animate-pulse rounded" />
        <div className="h-48 bg-secondary animate-pulse rounded-xl" />
        <div className="h-64 bg-secondary animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Contest not found</h2>
        <Link href="/contests" className="text-primary hover:underline mt-4 inline-block">
          Back to Contests
        </Link>
      </div>
    );
  }

  const prizes = contest.prizes ? JSON.parse(contest.prizes) : [
    { place: 1, amount: contest.prizePool * 0.5, label: "1st Place" },
    { place: 2, amount: contest.prizePool * 0.3, label: "2nd Place" },
    { place: 3, amount: contest.prizePool * 0.2, label: "3rd Place" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/contests"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Contests
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant={statusColors[contest.status] as any}>{contest.status}</Badge>
          <Badge
            variant="outline"
            style={{
              borderColor: `${getDifficultyColor(contest.difficulty)}40`,
              color: getDifficultyColor(contest.difficulty),
            }}
          >
            {contest.difficulty}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">{contest.title}</h1>
        <p className="text-muted-foreground mt-2">{contest.description}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <Card className="glass">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">${contest.prizePool.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">Prize Pool</p>
                </div>
                <div className="text-center">
                  <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">${contest.entryFee}</p>
                  <p className="text-xs text-muted-foreground">Entry Fee</p>
                </div>
                <div className="text-center">
                  <Users className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {contest.currentParticipants}/{contest.maxParticipants || "∞"}
                  </p>
                  <p className="text-xs text-muted-foreground">Players</p>
                </div>
                <div className="text-center">
                  <Clock className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{contest.duration}m</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          {contest.rules && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {contest.rules}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leaderboard */}
          {contest.entries.length > 0 && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Contest Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contest.entries.map((entry, i) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                    >
                      <div className="w-8 text-center font-bold text-muted-foreground">
                        {i + 1}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className="text-xs font-bold"
                          style={{
                            backgroundColor: `${getRankColor(entry.user.rank)}20`,
                            color: getRankColor(entry.user.rank),
                          }}
                        >
                          {entry.user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {entry.user.displayName || entry.user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Lv. {entry.user.level}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{entry.score}</p>
                        <p className="text-xs text-muted-foreground">pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Entry button */}
          <Card className="glass-strong neon-border">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Entry Fee</p>
              <p className="text-3xl font-bold neon-text mb-4">${contest.entryFee}</p>
              <p className="text-xs text-muted-foreground mb-4">
                {contest.commission}% platform commission · You receive {100 - contest.commission}% of prize
              </p>

              {!session?.user?.id ? (
                <Link href="/login">
                  <Button className="w-full" size="lg">
                    Sign in to Enter
                  </Button>
                </Link>
              ) : entered ? (
                <Button className="w-full" size="lg" variant="outline" disabled>
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  Entered
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleEnter}
                  disabled={entering || contest.status === "FINISHED"}
                >
                  {entering ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Swords className="h-5 w-5 mr-2" />
                  )}
                  Enter Contest
                </Button>
              )}

              <p className="text-xs text-muted-foreground mt-3">
                Pay with balance or USDT (TRC20)
              </p>
            </CardContent>
          </Card>

          {/* Prize distribution */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Prize Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prizes.map((prize: any) => (
                  <div
                    key={prize.place}
                    className="flex items-center justify-between p-2 rounded-lg bg-secondary/30"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {prize.place === 1 ? "🥇" : prize.place === 2 ? "🥈" : prize.place === 3 ? "🥉" : "🏆"}
                      </span>
                      <span className="text-sm">{prize.label}</span>
                    </div>
                    <span className="font-bold">${prize.amount.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Commission info */}
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <p className="font-medium text-foreground mb-1">How it works</p>
                  <p>
                    Entry fees fund the prize pool. Platform takes {contest.commission}%
                    commission. Winners receive their share automatically after
                    contest ends.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
