"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Crown,
  Check,
  Zap,
  Shield,
  Target,
  Trophy,
  Globe,
  Star,
  Loader2,
  Clock,
} from "lucide-react";

const premiumFeatures = [
  "500+ exclusive advanced challenges",
  "Priority contest entry (skip the queue)",
  "2x XP multiplier on all activities",
  "Advanced analytics and progress tracking",
  "Early access to new contests",
  "Premium-only leaderboards",
  "Dedicated Discord channel",
  "Monthly USDT rewards for top premium members",
];

const plans = [
  {
    key: "monthly" as const,
    name: "Monthly",
    price: 29.99,
    period: "month",
    popular: false,
  },
  {
    key: "quarterly" as const,
    name: "Quarterly",
    price: 74.99,
    period: "3 months",
    popular: true,
    savings: "17%",
  },
  {
    key: "annual" as const,
    name: "Annual",
    price: 249.99,
    period: "year",
    popular: false,
    savings: "31%",
  },
];

export default function PremiumPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [premiumStatus, setPremiumStatus] = useState<any>(null);

  useEffect(() => {
    fetch("/api/payments/premium", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPremiumStatus(data.data);
      });
  }, []);

  async function handleSubscribe(planKey: string) {
    setSubscribing(planKey);
    try {
      const res = await fetch("/api/payments/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        window.location.reload();
      } else {
        alert(data.error);
      }
    } finally {
      setSubscribing(null);
    }
  }

  const isPremium = premiumStatus?.isPremium;
  const expiry = premiumStatus?.expiry ? new Date(premiumStatus.expiry).toLocaleDateString() : null;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <Badge variant="warning" className="mb-4">
          <Crown className="w-3 h-3 mr-1" />
          PREMIUM
        </Badge>
        <h1 className="text-4xl font-bold mb-4">
          Unlock Your Full{" "}
          <span className="neon-text-purple">Potential</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get access to exclusive challenges, 2x XP, priority contest entry,
          and premium analytics. Pay with your USDT balance.
        </p>
      </div>

      {/* Current status */}
      {isPremium && (
        <Card className="glass-strong neon-border-purple max-w-4xl mx-auto">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Crown className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="font-semibold text-lg">Premium Active</p>
                <p className="text-sm text-muted-foreground">
                  Expires: {expiry}
                </p>
              </div>
            </div>
            <Badge variant="success">
              <Zap className="w-3 h-3 mr-1" />
              2x XP Active
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Pricing cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => {
          const canAfford = (user?.balance || 0) >= plan.price;
          return (
            <Card
              key={plan.name}
              className={`glass ${plan.popular ? "neon-border-purple relative" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="purple">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground text-sm">
                    /{plan.period}
                  </span>
                </div>
                {plan.savings && (
                  <Badge variant="success" className="mb-4">
                    Save {plan.savings}
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground mb-4">
                  Balance: ${(user?.balance || 0).toFixed(2)}
                </p>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan.key)}
                  disabled={subscribing === plan.key || isPremium || !canAfford}
                >
                  {subscribing === plan.key ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Crown className="h-4 w-4 mr-2" />
                  )}
                  {isPremium ? "Already Premium" : !canAfford ? "Insufficient Balance" : "Subscribe"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!isPremium && (
        <p className="text-center text-sm text-muted-foreground">
          Need balance?{" "}
          <a href="/wallet" className="text-primary hover:underline">
            Deposit USDT
          </a>{" "}
          from your wallet.
        </p>
      )}

      {/* Features */}
      <Card className="glass-strong max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Everything Included</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {premiumFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <Check className="h-5 w-5 text-green-400 shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment info */}
      <Card className="glass max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">How Payment Works</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>
              Premium subscriptions are paid from your ARKANUM wallet balance.
              Deposit USDT (TRC20) to your wallet, then use the balance to subscribe.
            </p>
            <p>
              Works from anywhere in the world, including Tajikistan. No bank restrictions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
