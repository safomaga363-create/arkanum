"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, EyeOff, Zap, Loader2, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [form, setForm] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    confirmPassword: "",
    country: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordChecks = [
    { label: t.auth.passwordChecks.minLength, valid: form.password.length >= 8 },
    { label: t.auth.passwordChecks.uppercase, valid: /[A-Z]/.test(form.password) },
    { label: t.auth.passwordChecks.number, valid: /[0-9]/.test(form.password) },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError(t.validation.passwordsNoMatch);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          displayName: form.displayName || form.username,
          password: form.password,
          country: form.country || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.validation.registrationFailed);
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError(t.validation.errorOccurred);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center rune-bg grid-bg px-4 py-8">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Shield className="h-10 w-10 text-primary group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] transition-all" />
          <span className="text-2xl font-bold tracking-wider">
            <span className="neon-text">AR</span>
            <span className="text-foreground">KA</span>
            <span className="neon-text-purple">NUM</span>
          </span>
        </Link>

        <Card className="glass-strong">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t.auth.registerTitle}</CardTitle>
            <CardDescription>
              {t.auth.registerSubtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t.auth.email}</label>
                <Input
                  type="email"
                  placeholder={t.auth.emailPlaceholder}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t.auth.username}</label>
                <Input
                  placeholder={t.auth.usernamePlaceholder}
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t.auth.displayName} <span className="text-muted-foreground">({t.common.optional})</span>
                </label>
                <Input
                  placeholder={t.auth.displayNamePlaceholder}
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t.auth.country}</label>
                <Input
                  placeholder={t.auth.countryPlaceholder}
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t.auth.password}</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t.auth.passwordPlaceholder}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.password && (
                  <div className="space-y-1 mt-2">
                    {passwordChecks.map((check) => (
                      <div key={check.label} className="flex items-center gap-2 text-xs">
                        <Check
                          className={`h-3 w-3 ${
                            check.valid ? "text-green-400" : "text-muted-foreground"
                          }`}
                        />
                        <span className={check.valid ? "text-green-400" : "text-muted-foreground"}>
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t.auth.confirmPassword}</label>
                <Input
                  type="password"
                  placeholder={t.auth.confirmPasswordPlaceholder}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="text-xs text-muted-foreground">
                {t.auth.byCreatingAccount}{" "}
                <Link href="/terms" className="text-primary hover:underline">{t.auth.terms}</Link>
                {" "}{t.auth.andConfirm}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    {t.auth.register}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {t.auth.hasAccount}{" "}
              <Link href="/login" className="text-primary hover:underline">
                {t.auth.login}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
