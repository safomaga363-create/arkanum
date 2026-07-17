"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
  Loader2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const OWNER_WALLET = process.env.NEXT_PUBLIC_OWNER_USDT_WALLET || "TXyz123...abc";

export default function WalletPage() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const user = session?.user;

  const [depositAmount, setDepositAmount] = useState("");
  const [depositTxHash, setDepositTxHash] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawWallet, setWithdrawWallet] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const [payments, setPayments] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/payments/history").then((r) => r.json()),
      fetch("/api/payments/withdraw").then((r) => r.json()),
    ]).then(([p, w]) => {
      if (p.success) setPayments(p.data);
      if (w.success) setWithdrawals(w.data);
    }).finally(() => setLoading(false));
  }, []);

  async function handleDeposit() {
    if (!depositAmount || !depositTxHash) return;
    setDepositLoading(true);
    try {
      const res = await fetch("/api/payments/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(depositAmount),
          txHash: depositTxHash,
          network: "TRC20",
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(t.wallet.depositSubmitted);
        setDepositAmount("");
        setDepositTxHash("");
        window.location.reload();
      } else {
        alert(data.error);
      }
    } finally {
      setDepositLoading(false);
    }
  }

  async function handleWithdraw() {
    if (!withdrawAmount || !withdrawWallet) return;
    setWithdrawLoading(true);
    try {
      const res = await fetch("/api/payments/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          wallet: withdrawWallet,
          network: "TRC20",
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(t.wallet.withdrawalRequested);
        setWithdrawAmount("");
        setWithdrawWallet("");
        window.location.reload();
      } else {
        alert(data.error);
      }
    } finally {
      setWithdrawLoading(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="neon-text">{t.wallet.title}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          {t.wallet.subtitle}
        </p>
      </div>

      {/* Balance card */}
      <Card className="glass-strong neon-border">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t.wallet.availableBalance}</p>
              <p className="text-4xl font-bold neon-text">
                ${(user?.balance || 0).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">USDT (TRC20)</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="flex gap-4 mt-6 text-sm">
            <div>
              <span className="text-muted-foreground">{t.wallet.totalEarned}: </span>
              <span className="font-medium text-green-400">${(user?.totalEarned || 0).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="deposit">
        <TabsList>
          <TabsTrigger value="deposit">
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            {t.wallet.deposit}
          </TabsTrigger>
          <TabsTrigger value="withdraw">
            <ArrowUpFromLine className="h-4 w-4 mr-2" />
            {t.wallet.withdraw}
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            {t.wallet.history}
          </TabsTrigger>
        </TabsList>

        {/* Deposit tab */}
        <TabsContent value="deposit" className="mt-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>{t.wallet.depositUsdt}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-sm font-medium mb-2">{t.wallet.sendTo}</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-primary flex-1 break-all">
                    {OWNER_WALLET}
                  </code>
                  <button
                    onClick={() => copyToClipboard(OWNER_WALLET)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t.wallet.onlyTrc20}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.wallet.amount}</label>
                  <Input
                    type="number"
                    placeholder="e.g. 50"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.wallet.txHash}</label>
                  <Input
                    placeholder={t.wallet.txHashPlaceholder}
                    value={depositTxHash}
                    onChange={(e) => setDepositTxHash(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t.wallet.txHashHint}
                  </p>
                </div>
                <Button
                  onClick={handleDeposit}
                  disabled={depositLoading || !depositAmount || !depositTxHash}
                >
                  {depositLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ArrowDownToLine className="h-4 w-4 mr-2" />
                  )}
                  {t.wallet.submitDeposit}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Withdraw tab */}
        <TabsContent value="withdraw" className="mt-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>{t.wallet.withdrawUsdt}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-sm text-yellow-400">
                {t.wallet.minWithdrawal}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.wallet.amount}</label>
                <Input
                  type="number"
                  placeholder={`Max: $${(user?.balance || 0).toFixed(2)}`}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="10"
                  max={user?.balance || 0}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.wallet.walletAddress}</label>
                <Input
                  placeholder={t.wallet.walletAddressPlaceholder}
                  value={withdrawWallet}
                  onChange={(e) => setWithdrawWallet(e.target.value)}
                />
              </div>

              {withdrawAmount && (
                <div className="p-3 rounded-lg bg-secondary/50 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.wallet.amountLabel}</span>
                    <span>${parseFloat(withdrawAmount || "0").toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.wallet.fee}</span>
                    <span>${(parseFloat(withdrawAmount || "0") * 0.01).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium mt-1 pt-1 border-t border-border">
                    <span>{t.wallet.youReceive}</span>
                    <span className="neon-text">
                      ${(parseFloat(withdrawAmount || "0") * 0.99).toFixed(2)} USDT
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleWithdraw}
                disabled={withdrawLoading || !withdrawAmount || !withdrawWallet || parseFloat(withdrawAmount) < 10}
              >
                {withdrawLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ArrowUpFromLine className="h-4 w-4 mr-2" />
                )}
                {t.wallet.requestWithdrawal}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History tab */}
        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">
            {/* Payments */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">{t.wallet.transactions}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-secondary animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : payments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">{t.wallet.noTransactions}</p>
                ) : (
                  <div className="space-y-2">
                    {payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-3">
                          {p.status === "COMPLETED" ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : p.status === "PENDING" ? (
                            <Clock className="h-5 w-5 text-yellow-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-400" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{p.description || p.type}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(p.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${p.type === "DEPOSIT" ? "text-green-400" : "text-red-400"}`}>
                            {p.type === "DEPOSIT" ? "+" : "-"}${p.amount.toFixed(2)}
                          </p>
                          <Badge
                            variant={p.status === "COMPLETED" ? "success" : p.status === "PENDING" ? "warning" : "destructive"}
                            className="text-xs"
                          >
                            {p.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Withdrawals */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">{t.wallet.withdrawals}</CardTitle>
              </CardHeader>
              <CardContent>
                {withdrawals.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">{t.wallet.noWithdrawals}</p>
                ) : (
                  <div className="space-y-2">
                    {withdrawals.map((w) => (
                      <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-3">
                          {w.status === "COMPLETED" ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : w.status === "PENDING" ? (
                            <Clock className="h-5 w-5 text-yellow-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-400" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{w.wallet}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(w.createdAt).toLocaleDateString()} · {t.wallet.fee1pct} ${w.fee.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-400">-${w.amount.toFixed(2)}</p>
                          <p className="text-xs text-green-400">{t.wallet.net} ${w.netAmount.toFixed(2)}</p>
                        </div>
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
