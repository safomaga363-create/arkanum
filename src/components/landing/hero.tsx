"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Swords,
  Trophy,
  Zap,
  Lock,
  Eye,
  Target,
  Flame,
  ArrowRight,
  ChevronRight,
  Star,
  Crown,
  Globe,
  Users,
  Activity,
  TrendingUp,
} from "lucide-react";

const stats = [
  { label: "Active Hackers", value: "12,847", icon: Users },
  { label: "Challenges Solved", value: "284,931", icon: Target },
  { label: "Prizes Distributed", value: "$847,200", icon: Trophy },
  { label: "Uptime", value: "99.99%", icon: Activity },
];

const features = [
  {
    icon: Zap,
    title: "Interactive Challenges",
    description:
      "Real-world scenarios in sandboxed environments. SQL injection, XSS, reverse engineering, cryptography and more.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: Swords,
    title: "Compete & Earn",
    description:
      "Join paid contests with entry fees. Top performers earn real USDT prizes. Platform takes only 20% commission.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Shield,
    title: "100% Ethical",
    description:
      "All challenges run in isolated sandboxes. Zero-day practice without legal risk. White-hat only.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: TrendingUp,
    title: "Learning Paths",
    description:
      "Structured courses from beginner to expert. Track your XP, level up, and climb the ranks.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: Lock,
    title: "USDT Payments",
    description:
      "Accept and withdraw USDT (TRC20). Fast, low fees, works globally including Central Asia.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Crown,
    title: "Premium Access",
    description:
      "Exclusive challenges, priority contest entry, higher XP multipliers, and advanced analytics.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

const ranks = [
  { name: "Bronze", color: "#cd7f32", xp: "0" },
  { name: "Silver", color: "#c0c0c0", xp: "1,000" },
  { name: "Gold", color: "#ffd700", xp: "5,000" },
  { name: "Platinum", color: "#00f0ff", xp: "15,000" },
  { name: "Diamond", color: "#b9f2ff", xp: "50,000" },
  { name: "Master", color: "#8b5cf6", xp: "100,000" },
  { name: "Legendary", color: "#ff6b6b", xp: "250,000" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden rune-bg grid-bg">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        <Badge variant="neon" className="mb-6 text-sm px-4 py-1">
          <Lock className="w-3 h-3 mr-1" />
          White-Hat Arena — 18+ Only
        </Badge>

        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-6">
          <span className="neon-text">Master</span>{" "}
          <span className="text-foreground">the Art of</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-neon-pink bg-clip-text text-transparent">
            Ethical Hacking
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
          The premium platform for competitive cybersecurity. Solve real-world
          challenges, compete in paid contests, earn USDT prizes, and climb the
          ranks from Bronze to Legendary.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/register">
            <Button size="xl" className="min-w-[200px]">
              <Zap className="h-5 w-5" />
              Start Hacking
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/challenges">
            <Button variant="outline" size="xl" className="min-w-[200px]">
              <Eye className="h-5 w-5" />
              Browse Challenges
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-xl p-4 text-center"
            >
              <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="purple" className="mb-4">
            <Flame className="w-3 h-3 mr-1" />
            Platform Features
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="neon-text">Level Up</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From learning basics to competing for real money — ARKANUM has it all
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass rounded-xl p-6 card-hover group"
            >
              <div
                className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RanksSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="warning" className="mb-4">
            <Crown className="w-3 h-3 mr-1" />
            Progression System
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            Climb the{" "}
            <span className="neon-text-purple">Ranks</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Earn XP by solving challenges and competing in contests. Each rank unlocks new privileges.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {ranks.map((rank, i) => (
            <div
              key={rank.name}
              className="glass rounded-xl p-4 min-w-[140px] text-center card-hover"
              style={{ borderColor: `${rank.color}33` }}
            >
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: rank.color }}
              >
                {rank.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {rank.xp} XP
              </div>
              <div className="mt-2 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${rank.color}, transparent)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="glass-strong rounded-2xl p-12 text-center relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
          
          <div className="relative z-10">
            <Globe className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Ready to{" "}
              <span className="neon-text">Enter the Arena?</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of ethical hackers worldwide. Start with free
              challenges, then compete in paid contests for real USDT prizes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="xl">
                  <Zap className="h-5 w-5" />
                  Create Free Account
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                Free to join. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
