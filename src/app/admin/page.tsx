"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Trophy,
  DollarSign,
  TrendingUp,
  Swords,
  Shield,
  Wallet,
  Plus,
  CheckCircle,
  XCircle,
  Loader2,
  BookOpen,
  Target,
  Trash2,
  Activity,
  UserPlus,
  Calendar,
  Crown,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useI18n();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const [contestForm, setContestForm] = useState({
    title: "",
    description: "",
    entryFee: "",
    commission: "20",
    difficulty: "MEDIUM",
    maxParticipants: "",
    duration: "120",
    startDate: "",
  });
  const [creatingContest, setCreatingContest] = useState(false);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [lpForm, setLpForm] = useState({ title: "", description: "", icon: "📚", color: "#00f0ff", difficulty: "MEDIUM" });
  const [challengeForm, setChallengeForm] = useState({ title: "", description: "", difficulty: "EASY", category: "Web Security", points: "100", xpReward: "50", entryFee: "0", learningPathId: "" });
  const [creatingLp, setCreatingLp] = useState(false);
  const [creatingChallenge, setCreatingChallenge] = useState(false);
  const [lessons, setLessons] = useState<any[]>([]);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    content: "",
    contentType: "TEXT",
    difficulty: "EASY",
    durationMin: "15",
    points: "100",
    xpReward: "50",
    learningPathId: "",
  });
  const [creatingLesson, setCreatingLesson] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN") {
      Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/admin/withdrawals").then((r) => r.json()),
        fetch("/api/admin/deposits").then((r) => r.json()),
        fetch("/api/admin/learning-paths").then((r) => r.json()),
        fetch("/api/admin/challenges").then((r) => r.json()),
        fetch("/api/admin/lessons").then((r) => r.json()),
      ]).then(([s, w, d, lp, ch, ls]) => {
        if (s.success) setStats(s.data);
        if (w.success) setWithdrawals(w.data);
        if (d.success) setDeposits(d.data);
        if (lp.success) setLearningPaths(lp.data);
        if (ch.success) setChallenges(ch.data);
        if (ls.success) setLessons(ls.data);
      }).finally(() => setLoading(false));
    }
  }, [session]);

  async function handleWithdrawal(withdrawalId: string, action: "approve" | "reject") {
    setProcessing(withdrawalId);
    try {
      const res = await fetch("/api/admin/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawalId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setWithdrawals(withdrawals.map(w =>
          w.id === withdrawalId ? { ...w, status: action === "approve" ? "COMPLETED" : "REJECTED" } : w
        ));
      }
    } finally {
      setProcessing(null);
    }
  }

  async function handleDeposit(paymentId: string, action: "approve" | "reject") {
    setProcessing(paymentId);
    try {
      const res = await fetch("/api/admin/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setDeposits(deposits.map(d =>
          d.id === paymentId ? { ...d, status: action === "approve" ? "COMPLETED" : "REFUNDED" } : d
        ));
      }
    } finally {
      setProcessing(null);
    }
  }

  async function handleCreateContest() {
    if (!contestForm.title || !contestForm.entryFee || !contestForm.startDate) return;
    setCreatingContest(true);
    try {
      const res = await fetch("/api/contests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: contestForm.title,
          description: contestForm.description,
          entryFee: parseFloat(contestForm.entryFee),
          commission: parseFloat(contestForm.commission),
          difficulty: contestForm.difficulty,
          maxParticipants: contestForm.maxParticipants ? parseInt(contestForm.maxParticipants) : undefined,
          duration: parseInt(contestForm.duration),
          startDate: new Date(contestForm.startDate).toISOString(),
          endDate: new Date(new Date(contestForm.startDate).getTime() + parseInt(contestForm.duration) * 60000).toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Contest created successfully!");
        setContestForm({ title: "", description: "", entryFee: "", commission: "20", difficulty: "MEDIUM", maxParticipants: "", duration: "120", startDate: "" });
        const sRes = await fetch("/api/admin/stats");
        const sData = await sRes.json();
        if (sData.success) setStats(sData.data);
      } else {
        alert(data.error || "Failed to create contest");
      }
    } finally {
      setCreatingContest(false);
    }
  }

  async function handleCreateLp() {
    if (!lpForm.title || !lpForm.description) return;
    setCreatingLp(true);
    try {
      const res = await fetch("/api/admin/learning-paths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lpForm),
      });
      const data = await res.json();
      if (data.success) {
        alert("Learning path created!");
        setLearningPaths([...learningPaths, data.data]);
        setLpForm({ title: "", description: "", icon: "📚", color: "#00f0ff", difficulty: "MEDIUM" });
      } else {
        alert(data.error || "Failed");
      }
    } finally {
      setCreatingLp(false);
    }
  }

  async function handleDeleteLp(id: string) {
    if (!confirm("Delete this learning path?")) return;
    const res = await fetch(`/api/admin/learning-paths?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) setLearningPaths(learningPaths.filter((lp) => lp.id !== id));
  }

  async function handleCreateChallenge() {
    if (!challengeForm.title || !challengeForm.description) return;
    setCreatingChallenge(true);
    try {
      const res = await fetch("/api/admin/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...challengeForm,
          points: parseInt(challengeForm.points),
          xpReward: parseInt(challengeForm.xpReward),
          entryFee: parseFloat(challengeForm.entryFee),
          learningPathId: challengeForm.learningPathId || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Challenge created!");
        setChallenges([data.data, ...challenges]);
        setChallengeForm({ title: "", description: "", difficulty: "EASY", category: "Web Security", points: "100", xpReward: "50", entryFee: "0", learningPathId: "" });
      } else {
        alert(data.error || "Failed");
      }
    } finally {
      setCreatingChallenge(false);
    }
  }

  async function handleDeleteChallenge(id: string) {
    if (!confirm("Delete this challenge?")) return;
    const res = await fetch(`/api/admin/challenges?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) setChallenges(challenges.filter((c) => c.id !== id));
  }

  async function handleCreateLesson() {
    if (!lessonForm.title || !lessonForm.description || !lessonForm.learningPathId) return;
    setCreatingLesson(true);
    try {
      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: lessonForm.title,
          description: lessonForm.description,
          content: lessonForm.content || undefined,
          contentType: lessonForm.contentType,
          difficulty: lessonForm.difficulty,
          durationMin: parseInt(lessonForm.durationMin),
          points: parseInt(lessonForm.points),
          xpReward: parseInt(lessonForm.xpReward),
          learningPathId: lessonForm.learningPathId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Lesson created!");
        setLessons([data.data, ...lessons]);
        setLessonForm({
          title: "", description: "", content: "", contentType: "TEXT",
          difficulty: "EASY", durationMin: "15", points: "100", xpReward: "50", learningPathId: "",
        });
      } else {
        alert(data.error || "Failed");
      }
    } finally {
      setCreatingLesson(false);
    }
  }

  async function handleDeleteLesson(id: string) {
    if (!confirm("Delete this lesson?")) return;
    const res = await fetch(`/api/admin/lessons?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) setLessons(lessons.filter((l) => l.id !== id));
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-10 w-64 bg-secondary animate-pulse rounded" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass animate-pulse">
              <CardContent className="p-5 h-24" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const adminStats = [
    {
      label: t.admin.totalUsers,
      value: stats?.totalUsers?.toLocaleString() || "0",
      sub: `+${stats?.newUsersToday || 0} today`,
      icon: Users,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      label: t.admin.activeContests,
      value: stats?.activeContests || "0",
      sub: `${stats?.totalContests || 0} total`,
      icon: Swords,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: t.admin.platformEarnings,
      value: `$${(stats?.platformEarnings || 0).toFixed(0)}`,
      sub: `$${(stats?.monthlyRevenue || 0).toFixed(0)} this month`,
      icon: DollarSign,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: t.admin.pendingWithdrawals,
      value: stats?.pendingWithdrawals || "0",
      sub: `${stats?.pendingDeposits || 0} pending deposits`,
      icon: Wallet,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
  ];

  const secondaryStats = [
    {
      label: t.admin.activeUsers,
      value: stats?.activeUsers?.toLocaleString() || "0",
      icon: Activity,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      label: t.admin.premiumUsers,
      value: stats?.premiumUsers || "0",
      icon: Crown,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      label: t.admin.lessonsCompleted,
      value: stats?.lessonsCompleted?.toLocaleString() || "0",
      sub: `/ ${stats?.totalLessons || 0} total`,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: t.admin.totalRevenue,
      value: `$${(stats?.totalRevenue || 0).toFixed(0)}`,
      sub: `$${(stats?.totalDeposited || 0).toFixed(0)} deposited`,
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="neon-text">{t.admin.title}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.admin.subtitle}
          </p>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat) => (
          <Card key={stat.label} className="glass">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  {stat.sub && <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>}
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map((stat) => (
          <Card key={stat.label} className="glass">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                  {stat.sub && <p className="text-xs text-muted-foreground">{stat.sub}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="deposits">
        <TabsList>
          <TabsTrigger value="deposits">
            <DollarSign className="h-4 w-4 mr-2" />
            {t.admin.deposits} ({deposits.filter((d) => d.status === "PENDING").length})
          </TabsTrigger>
          <TabsTrigger value="withdrawals">
            <Wallet className="h-4 w-4 mr-2" />
            {t.admin.withdrawals} ({withdrawals.filter((w) => w.status === "PENDING").length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t.admin.analytics}
          </TabsTrigger>
          <TabsTrigger value="contests">
            <Swords className="h-4 w-4 mr-2" />
            {t.admin.createContest}
          </TabsTrigger>
          <TabsTrigger value="learning-paths">
            <BookOpen className="h-4 w-4 mr-2" />
            {t.admin.learningPaths} ({learningPaths.length})
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <Target className="h-4 w-4 mr-2" />
            {t.admin.challenges} ({challenges.length})
          </TabsTrigger>
          <TabsTrigger value="lessons">
            <BookOpen className="h-4 w-4 mr-2" />
            {t.admin.lessonsManagement}
          </TabsTrigger>
        </TabsList>

        {/* Deposits */}
        <TabsContent value="deposits" className="mt-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>{t.admin.depositRequests}</CardTitle>
            </CardHeader>
            <CardContent>
              {deposits.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">{t.admin.noDeposits}</p>
              ) : (
                <div className="space-y-3">
                  {deposits.map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{d.user?.username}</p>
                          <p className="text-xs text-muted-foreground">
                            TX: {d.txHash?.slice(0, 16)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-green-400">+${d.amount}</p>
                        <Badge
                          variant={d.status === "COMPLETED" ? "success" : d.status === "PENDING" ? "warning" : "destructive"}
                        >
                          {d.status}
                        </Badge>
                        {d.status === "PENDING" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleDeposit(d.id, "approve")}
                              disabled={processing === d.id}
                            >
                              {processing === d.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeposit(d.id, "reject")}
                              disabled={processing === d.id}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Withdrawals */}
        <TabsContent value="withdrawals" className="mt-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-yellow-400" />
                {t.admin.withdrawalRequests}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {withdrawals.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">{t.admin.noWithdrawals}</p>
              ) : (
                <div className="space-y-3">
                  {withdrawals.map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div>
                        <p className="text-sm font-medium">{w.user?.username}</p>
                        <p className="text-xs text-muted-foreground">{w.wallet}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold">${w.amount} USDT</p>
                        <Badge
                          variant={w.status === "COMPLETED" ? "success" : w.status === "PENDING" ? "warning" : "destructive"}
                        >
                          {w.status}
                        </Badge>
                        {w.status === "PENDING" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleWithdrawal(w.id, "approve")}
                              disabled={processing === w.id}
                            >
                              {processing === w.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleWithdrawal(w.id, "reject")}
                              disabled={processing === w.id}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>{t.admin.revenueOverview}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t.admin.totalRevenue}</span>
                    <span className="font-bold">${(stats?.totalRevenue || 0).toFixed(2)}</span>
                  </div>
                  <Progress value={100} />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t.admin.platformEarningsLabel}</span>
                    <span className="font-bold neon-text">${(stats?.platformEarnings || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t.admin.premiumUsers}</span>
                    <span className="font-bold">{stats?.premiumUsers || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t.admin.lessonsCompleted}</span>
                    <span className="font-bold">{stats?.lessonsCompleted || 0} / {stats?.totalLessons || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardHeader>
                <CardTitle>{t.admin.topPlayers}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(stats?.topPlayers || []).slice(0, 5).map((player: any, i: number) => (
                    <div key={player.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                      <span className="text-sm font-bold text-muted-foreground w-6">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{player.username}</p>
                        <p className="text-xs text-muted-foreground">Lv. {player.level} · {player.rank}</p>
                      </div>
                      <span className="text-sm font-bold neon-text">{player.xp.toLocaleString()} XP</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Create Contest */}
        <TabsContent value="contests" className="mt-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                {t.admin.createNewContest}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.admin.title_label}</label>
                  <Input
                    placeholder="e.g. Web Exploitation Arena"
                    value={contestForm.title}
                    onChange={(e) => setContestForm({ ...contestForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.admin.difficultyLabel}</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm"
                    value={contestForm.difficulty}
                    onChange={(e) => setContestForm({ ...contestForm, difficulty: e.target.value })}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.admin.description}</label>
                <Textarea
                  placeholder="Describe the contest..."
                  value={contestForm.description}
                  onChange={(e) => setContestForm({ ...contestForm, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.admin.entryFee_label}</label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={contestForm.entryFee}
                    onChange={(e) => setContestForm({ ...contestForm, entryFee: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.admin.commission}</label>
                  <Input
                    type="number"
                    placeholder="20"
                    value={contestForm.commission}
                    onChange={(e) => setContestForm({ ...contestForm, commission: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.admin.maxPlayers}</label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={contestForm.maxParticipants}
                    onChange={(e) => setContestForm({ ...contestForm, maxParticipants: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.admin.durationMin}</label>
                  <Input
                    type="number"
                    placeholder="120"
                    value={contestForm.duration}
                    onChange={(e) => setContestForm({ ...contestForm, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.admin.startDateTime}</label>
                <Input
                  type="datetime-local"
                  value={contestForm.startDate}
                  onChange={(e) => setContestForm({ ...contestForm, startDate: e.target.value })}
                />
              </div>

              <Button onClick={handleCreateContest} disabled={creatingContest || !contestForm.title || !contestForm.entryFee}>
                {creatingContest ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {t.admin.createContest}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Paths */}
        <TabsContent value="learning-paths" className="mt-6">
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  {t.admin.createLearningPath}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.admin.title_label}</label>
                    <Input placeholder="e.g. Web Security Fundamentals" value={lpForm.title} onChange={(e) => setLpForm({ ...lpForm, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Icon</label>
                    <Input placeholder="📚" value={lpForm.icon} onChange={(e) => setLpForm({ ...lpForm, icon: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.admin.description}</label>
                  <Textarea placeholder="Describe this learning path..." value={lpForm.description} onChange={(e) => setLpForm({ ...lpForm, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <Input type="color" value={lpForm.color} onChange={(e) => setLpForm({ ...lpForm, color: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Difficulty</label>
                    <select className="flex h-10 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" value={lpForm.difficulty} onChange={(e) => setLpForm({ ...lpForm, difficulty: e.target.value })}>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                </div>
                <Button onClick={handleCreateLp} disabled={creatingLp || !lpForm.title}>
                  {creatingLp ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {t.admin.createLearningPath}
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader><CardTitle>{t.admin.existingLearningPaths} ({learningPaths.length})</CardTitle></CardHeader>
              <CardContent>
                {learningPaths.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">{t.admin.learningPaths} - None</p>
                ) : (
                  <div className="space-y-2">
                    {learningPaths.map((lp) => (
                      <div key={lp.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{lp.icon}</span>
                          <div>
                            <p className="font-medium">{lp.title}</p>
                            <p className="text-xs text-muted-foreground">{lp._count?.lessons || 0} {t.learning.lessonsCount} · {lp.difficulty}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteLp(lp.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Challenges */}
        <TabsContent value="challenges" className="mt-6">
          <div className="space-y-6">
            <Link href="/admin/challenges/create">
              <Button className="w-full" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                {t.admin.createChallenge} — Full Page
              </Button>
            </Link>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  {t.admin.createChallenge}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.admin.title_label}</label>
                    <Input placeholder="e.g. SQL Injection Basics" value={challengeForm.title} onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.challenges.category}</label>
                    <Input placeholder="Web Security" value={challengeForm.category} onChange={(e) => setChallengeForm({ ...challengeForm, category: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.admin.description}</label>
                  <Textarea placeholder="Describe this challenge..." value={challengeForm.description} onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Difficulty</label>
                    <select className="flex h-10 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" value={challengeForm.difficulty} onChange={(e) => setChallengeForm({ ...challengeForm, difficulty: e.target.value })}>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.challenges.points}</label>
                    <Input type="number" value={challengeForm.points} onChange={(e) => setChallengeForm({ ...challengeForm, points: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.challenges.xpReward}</label>
                    <Input type="number" value={challengeForm.xpReward} onChange={(e) => setChallengeForm({ ...challengeForm, xpReward: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.admin.entryFee_label}</label>
                    <Input type="number" value={challengeForm.entryFee} onChange={(e) => setChallengeForm({ ...challengeForm, entryFee: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.admin.learningPaths}</label>
                  <select className="flex h-10 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" value={challengeForm.learningPathId} onChange={(e) => setChallengeForm({ ...challengeForm, learningPathId: e.target.value })}>
                    <option value="">None</option>
                    {learningPaths.map((lp) => (
                      <option key={lp.id} value={lp.id}>{lp.title}</option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleCreateChallenge} disabled={creatingChallenge || !challengeForm.title}>
                  {creatingChallenge ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {t.admin.createChallenge}
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader><CardTitle>{t.admin.existingChallenges} ({challenges.length})</CardTitle></CardHeader>
              <CardContent>
                {challenges.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">{t.challenges.noChallenges}</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {challenges.map((ch) => (
                      <div key={ch.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-3">
                          <Badge variant={ch.difficulty === "EASY" ? "success" : ch.difficulty === "MEDIUM" ? "warning" : "destructive"} className="text-xs">
                            {ch.difficulty}
                          </Badge>
                          <div>
                            <p className="font-medium text-sm">{ch.title}</p>
                            <p className="text-xs text-muted-foreground">{ch.category} · {ch.points} {t.common.pts} · {ch.xpReward} XP {ch.entryFee > 0 ? `· $${ch.entryFee}` : `· ${t.challenges.free}`}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteChallenge(ch.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Lessons Management */}
        <TabsContent value="lessons" className="mt-6">
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  {t.admin.createLesson}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.admin.lessonTitle}</label>
                    <Input placeholder="e.g. Introduction to SQL Injection" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.admin.selectLearningPath}</label>
                    <select className="flex h-10 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" value={lessonForm.learningPathId} onChange={(e) => setLessonForm({ ...lessonForm, learningPathId: e.target.value })}>
                      <option value="">{t.admin.selectLearningPath}</option>
                      {learningPaths.map((lp) => (
                        <option key={lp.id} value={lp.id}>{lp.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.admin.lessonDescription}</label>
                  <Textarea placeholder="Describe this lesson..." value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.admin.contentMarkdown}</label>
                  <Textarea placeholder="Lesson content in Markdown..." value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} className="min-h-[120px] font-mono text-sm" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.admin.contentType}</label>
                    <select className="flex h-10 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" value={lessonForm.contentType} onChange={(e) => setLessonForm({ ...lessonForm, contentType: e.target.value })}>
                      <option value="TEXT">Text</option>
                      <option value="VIDEO">Video</option>
                      <option value="INTERACTIVE">Interactive</option>
                      <option value="QUIZ">Quiz</option>
                      <option value="PRACTICAL">Practical</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.admin.difficultyLabel}</label>
                    <select className="flex h-10 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" value={lessonForm.difficulty} onChange={(e) => setLessonForm({ ...lessonForm, difficulty: e.target.value })}>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.admin.durationMinutes}</label>
                    <Input type="number" value={lessonForm.durationMin} onChange={(e) => setLessonForm({ ...lessonForm, durationMin: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.admin.pointsLabel}</label>
                    <Input type="number" value={lessonForm.points} onChange={(e) => setLessonForm({ ...lessonForm, points: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.admin.xpRewardLabel}</label>
                    <Input type="number" value={lessonForm.xpReward} onChange={(e) => setLessonForm({ ...lessonForm, xpReward: e.target.value })} />
                  </div>
                </div>
                <Button onClick={handleCreateLesson} disabled={creatingLesson || !lessonForm.title || !lessonForm.learningPathId}>
                  {creatingLesson ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {t.admin.createLesson}
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader><CardTitle>{t.admin.existingLessons} ({lessons.length})</CardTitle></CardHeader>
              <CardContent>
                {lessons.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">{t.admin.lessonsManagement} - None</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-3">
                          <Badge variant={lesson.difficulty === "EASY" ? "success" : lesson.difficulty === "MEDIUM" ? "warning" : "destructive"} className="text-xs">
                            {lesson.difficulty}
                          </Badge>
                          <div>
                            <p className="font-medium text-sm">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">{lesson.learningPath?.title || "N/A"} · {lesson.contentType} · {lesson.durationMin}m · {lesson.xpReward} XP</p>
                          </div>
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteLesson(lesson.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
