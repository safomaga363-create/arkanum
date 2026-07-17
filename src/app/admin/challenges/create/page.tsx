"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Plus,
  Loader2,
  Target,
  Zap,
  DollarSign,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface LearningPath {
  id: string;
  title: string;
  slug: string;
}

export default function CreateChallengePage() {
  const router = useRouter();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    difficulty: "EASY",
    category: "Web Security",
    points: "100",
    xpReward: "50",
    entryFee: "0",
    learningPathId: "",
  });

  useEffect(() => {
    fetch("/api/admin/learning-paths", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setLearningPaths(data.data);
      });
  }, []);

  const categories = [
    "Web Security",
    "Cryptography",
    "Binary Exploitation",
    "Reverse Engineering",
    "Forensics",
    "Networking",
    "OSINT",
    "Misc",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          content: form.content || undefined,
          difficulty: form.difficulty,
          category: form.category,
          points: parseInt(form.points),
          xpReward: parseInt(form.xpReward),
          entryFee: parseFloat(form.entryFee),
          learningPathId: form.learningPathId || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/admin"), 2000);
      } else {
        alert(data.error || "Failed to create challenge");
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Challenge Created!</h1>
        <p className="text-muted-foreground">Redirecting to admin panel...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.common.back}
      </Link>

      <div>
        <h1 className="text-3xl font-bold">
          <span className="neon-text">{t.admin.createChallenge}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Create a new hacking challenge for users to solve.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="glass">
          <CardContent className="p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                {t.admin.title_label} *
              </label>
              <Input
                placeholder="e.g. SQL Injection Login Bypass"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.admin.description} *</label>
              <Textarea
                placeholder="Brief description of the challenge (shown in list)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={3}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Challenge Content (Markdown)</label>
              <Textarea
                placeholder={"## Challenge Briefing\n\nYour task is to...\n\n### Target\n`/target/endpoint`\n\n### Steps\n1. ...\n2. ..."}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Full markdown content shown on the challenge detail page.
              </p>
            </div>

            {/* Difficulty + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.admin.difficultyLabel}</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm"
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="EXPERT">Expert</option>
                  <option value="LEGENDARY">Legendary</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.challenges.category}</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Points + XP + Fee */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Target className="h-3 w-3" /> {t.challenges.points}
                </label>
                <Input
                  type="number"
                  value={form.points}
                  onChange={(e) => setForm({ ...form, points: e.target.value })}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Zap className="h-3 w-3 text-cyan-400" /> {t.challenges.xpReward}
                </label>
                <Input
                  type="number"
                  value={form.xpReward}
                  onChange={(e) => setForm({ ...form, xpReward: e.target.value })}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-green-400" /> {t.admin.entryFee_label}
                </label>
                <Input
                  type="number"
                  value={form.entryFee}
                  onChange={(e) => setForm({ ...form, entryFee: e.target.value })}
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground">
                  {parseFloat(form.entryFee) === 0 ? "Free challenge" : `$${form.entryFee} to enter`}
                </p>
              </div>
            </div>

            {/* Learning Path */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                {t.admin.learningPaths} (optional)
              </label>
              <select
                className="flex h-10 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm"
                value={form.learningPathId}
                onChange={(e) => setForm({ ...form, learningPathId: e.target.value })}
              >
                <option value="">No learning path</option>
                {learningPaths.map((lp) => (
                  <option key={lp.id} value={lp.id}>{lp.title}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Link this challenge to a learning path so students see it in context.
              </p>
            </div>

            {/* Preview */}
            <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Preview</p>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  style={{
                    borderColor: form.difficulty === "EASY" ? "#22c55e40" : form.difficulty === "MEDIUM" ? "#eab30840" : "#ef444440",
                    color: form.difficulty === "EASY" ? "#22c55e" : form.difficulty === "MEDIUM" ? "#eab308" : "#ef4444",
                  }}
                >
                  {form.difficulty}
                </Badge>
                <Badge variant="secondary">{form.category}</Badge>
                {parseFloat(form.entryFee) === 0 ? (
                  <Badge variant="neon">{t.challenges.free}</Badge>
                ) : (
                  <Badge variant="warning">${form.entryFee}</Badge>
                )}
              </div>
              <h3 className="font-semibold">{form.title || "Challenge Title"}</h3>
              <p className="text-sm text-muted-foreground">{form.description || "Challenge description..."}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {form.points} pts</span>
                <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-cyan-400" /> {form.xpReward} XP</span>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4">
              <Button type="submit" size="lg" disabled={loading || !form.title || !form.description}>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Plus className="h-5 w-5 mr-2" />
                )}
                {t.admin.createChallenge}
              </Button>
              <Link href="/admin">
                <Button type="button" variant="ghost" size="lg">
                  {t.common.cancel}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
