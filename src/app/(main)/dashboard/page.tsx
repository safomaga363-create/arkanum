"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Trophy,
  Swords,
  Target,
  TrendingUp,
  Clock,
  Crown,
  ArrowUpRight,
} from "lucide-react";
import { getRankColor } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const user = session?.user;

  const xpForNextLevel = (user?.level || 1) * 500;
  const xpProgress = user?.xp ? (user.xp % 500) / 5 : 0;

  const stats = [
    {
      label: t.dashboard.totalXP,
      value: (user?.xp || 0).toLocaleString(),
      change: `${t.dashboard.rank} ${user?.level || 1}`,
      icon: Zap,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      label: t.dashboard.balance,
      value: `$${(user?.balance || 0).toFixed(2)}`,
      change: t.dashboard.balanceInfo,
      icon: Target,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: t.dashboard.totalEarned,
      value: `$${(user?.totalEarned || 0).toFixed(2)}`,
      change: t.dashboard.totalEarnedInfo,
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: t.dashboard.account,
      value: user?.isPremium ? t.dashboard.accountPremium : t.dashboard.accountFree,
      change: user?.isPremium ? t.dashboard.accountPremiumActive : t.dashboard.accountFreeUpgrade,
      icon: Crown,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          {t.dashboard.welcome}, <span className="neon-text">{user?.displayName || user?.username || "Hacker"}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          {t.dashboard.subtitle}
        </p>
      </div>

      {/* Level progress */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.dashboard.currentLevel}</p>
                <p className="text-2xl font-bold neon-text">{t.dashboard.rank} {user?.level || 1}</p>
              </div>
            </div>
            <Badge variant="neon">{user?.rank || "BRONZE"}</Badge>
          </div>
          <Progress value={xpProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {(user?.xp || 0).toLocaleString()} / {xpForNextLevel.toLocaleString()} {t.dashboard.xpToNext} {(user?.level || 1) + 1}
          </p>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              {t.dashboard.quickActions}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/challenges"
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{t.dashboard.browseChallenges}</p>
                  <p className="text-xs text-muted-foreground">{t.dashboard.browseChallengesSub}</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link
              href="/contests"
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Swords className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm font-medium">{t.dashboard.activeContests}</p>
                  <p className="text-xs text-muted-foreground">{t.dashboard.activeContestsSub}</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-400 transition-colors" />
            </Link>
            {!user?.isPremium && (
              <Link
                href="/premium"
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-sm font-medium">{t.dashboard.upgradePremium}</p>
                    <p className="text-xs text-muted-foreground">{t.dashboard.upgradePremiumSub}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-yellow-400 transition-colors" />
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t.dashboard.recentActivity}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <p className="text-sm">{t.dashboard.welcomeMsg}</p>
                  <p className="text-xs text-muted-foreground">{t.dashboard.justNow}</p>
                </div>
              </div>
              {user?.isPremium && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm">{t.dashboard.premiumActive}</p>
                    <p className="text-xs text-muted-foreground">{t.dashboard.premiumXp}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
