"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
      ]).then(([s, w, d, lp, ch]) => {
        if (s.success) setStats(s.data);
        if (w.success) setWithdrawals(w.data);
        if (d.success) setDeposits(d.data);
        if (lp.success) setLearningPaths(lp.data);
        if (ch.success) setChallenges(ch.data);
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
        // Refresh stats
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
      label: "Total Users",
      value: stats?.totalUsers?.toLocaleString() || "0",
      icon: Users,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      label: "Active Contests",
      value: stats?.activeContests || "0",
      icon: Swords,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Platform Earnings",
      value: `$${(stats?.platformEarnings || 0).toFixed(0)}`,
      icon: DollarSign,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Pending Withdrawals",
      value: stats?.pendingWithdrawals || "0",
      icon: Wallet,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="neon-text">Admin</span> Panel
          </h1>
          <p className="text-muted-foreground mt-1">
            Platform management and financial overview.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat) => (
          <Card key={stat.label} className="glass">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
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
            Deposits ({deposits.filter((d) => d.status === "PENDING").length})
          </TabsTrigger>
          <TabsTrigger value="withdrawals">
            <Wallet className="h-4 w-4 mr-2" />
            Withdrawals ({withdrawals.filter((w) => w.status === "PENDING").length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="contests">
            <Swords className="h-4 w-4 mr-2" />
            Create Contest
          </TabsTrigger>
          <TabsTrigger value="learning-paths">
            <BookOpen className="h-4 w-4 mr-2" />
            Learning Paths ({learningPaths.length})
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <Target className="h-4 w-4 mr-2" />
            Challenges ({challenges.length})
          </TabsTrigger>
        </TabsList>

        {/* Deposits */}
        <TabsContent value="deposits" className="mt-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Deposit Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {deposits.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No deposits</p>
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
                Withdrawal Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {withdrawals.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No withdrawals</p>
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
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Revenue</span>
                    <span className="font-bold">${(stats?.totalRevenue || 0).toFixed(2)}</span>
                  </div>
                  <Progress value={100} />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Platform Earnings (20%)</span>
                    <span className="font-bold neon-text">${(stats?.platformEarnings || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Premium Users</span>
                    <span className="font-bold">{stats?.premiumUsers || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardHeader>
                <CardTitle>Top Players</CardTitle>
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
                Create New Contest
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="e.g. Web Exploitation Arena"
                    value={contestForm.title}
                    onChange={(e) => setContestForm({ ...contestForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
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
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe the contest..."
                  value={contestForm.description}
                  onChange={(e) => setContestForm({ ...contestForm, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Entry Fee ($)</label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={contestForm.entryFee}
                    onChange={(e) => setContestForm({ ...contestForm, entryFee: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Commission (%)</label>
                  <Input
                    type="number"
                    placeholder="20"
                    value={contestForm.commission}
                    onChange={(e) => setContestForm({ ...contestForm, commission: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Players</label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={contestForm.maxParticipants}
                    onChange={(e) => setContestForm({ ...contestForm, maxParticipants: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (min)</label>
                  <Input
                    type="number"
                    placeholder="120"
                    value={contestForm.duration}
                    onChange={(e) => setContestForm({ ...contestForm, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date & Time</label>
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
                Create Contest
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
                  Create Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input placeholder="e.g. Web Security Fundamentals" value={lpForm.title} onChange={(e) => setLpForm({ ...lpForm, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Icon</label>
                    <Input placeholder="📚" value={lpForm.icon} onChange={(e) => setLpForm({ ...lpForm, icon: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
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
                  Create Learning Path
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader><CardTitle>Existing Learning Paths ({learningPaths.length})</CardTitle></CardHeader>
              <CardContent>
                {learningPaths.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No learning paths</p>
                ) : (
                  <div className="space-y-2">
                    {learningPaths.map((lp) => (
                      <div key={lp.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{lp.icon}</span>
                          <div>
                            <p className="font-medium">{lp.title}</p>
                            <p className="text-xs text-muted-foreground">{lp._count?.lessons || 0} lessons · {lp.difficulty}</p>
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
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Create Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input placeholder="e.g. SQL Injection Basics" value={challengeForm.title} onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Input placeholder="Web Security" value={challengeForm.category} onChange={(e) => setChallengeForm({ ...challengeForm, category: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
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
                    <label className="text-sm font-medium">Points</label>
                    <Input type="number" value={challengeForm.points} onChange={(e) => setChallengeForm({ ...challengeForm, points: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">XP Reward</label>
                    <Input type="number" value={challengeForm.xpReward} onChange={(e) => setChallengeForm({ ...challengeForm, xpReward: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Entry Fee ($)</label>
                    <Input type="number" value={challengeForm.entryFee} onChange={(e) => setChallengeForm({ ...challengeForm, entryFee: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Learning Path</label>
                  <select className="flex h-10 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" value={challengeForm.learningPathId} onChange={(e) => setChallengeForm({ ...challengeForm, learningPathId: e.target.value })}>
                    <option value="">None</option>
                    {learningPaths.map((lp) => (
                      <option key={lp.id} value={lp.id}>{lp.title}</option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleCreateChallenge} disabled={creatingChallenge || !challengeForm.title}>
                  {creatingChallenge ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  Create Challenge
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader><CardTitle>Existing Challenges ({challenges.length})</CardTitle></CardHeader>
              <CardContent>
                {challenges.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No challenges</p>
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
                            <p className="text-xs text-muted-foreground">{ch.category} · {ch.points} pts · {ch.xpReward} XP {ch.entryFee > 0 ? `· $${ch.entryFee}` : "· Free"}</p>
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
      </Tabs>
    </div>
  );
}
