"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Trophy,
  Crown,
  Medal,
  Users,
} from "lucide-react";
import { getRankColor } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

interface Player {
  id: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
  xp: number;
  level: number;
  rank: string;
  country: string | null;
  totalEarned: number;
}

function getRankForXP(xp: number): string {
  if (xp >= 250000) return "LEGENDARY";
  if (xp >= 100000) return "MASTER";
  if (xp >= 50000) return "DIAMOND";
  if (xp >= 15000) return "PLATINUM";
  if (xp >= 5000) return "GOLD";
  if (xp >= 1000) return "SILVER";
  return "BRONZE";
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { t } = useI18n();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?page=${page}&pageSize=50`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlayers(data.data.items);
          setTotal(data.data.total);
        }
      })
      .finally(() => setLoading(false));
  }, [page]);

  const top3 = players.slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="neon-text-purple">{t.leaderboard.title}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          {t.leaderboard.subtitle}
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass animate-pulse">
                <CardContent className="p-5 h-40" />
              </Card>
            ))}
          </div>
          <Card className="glass animate-pulse">
            <CardContent className="p-6 h-96" />
          </Card>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          {top3.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[1, 0, 2].map((idx) => {
                const player = top3[idx];
                if (!player) return null;
                const isFirst = idx === 0;
                return (
                  <Card
                    key={player.id}
                    className={`glass ${isFirst ? "neon-border-purple -mt-4" : ""}`}
                  >
                    <CardContent className={`p-5 text-center ${isFirst ? "pt-8" : ""}`}>
                      {isFirst && <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />}
                      <Avatar className={`mx-auto mb-2 ${isFirst ? "h-16 w-16" : "h-12 w-12"}`}>
                        <AvatarFallback
                          className="font-bold"
                          style={{
                            backgroundColor: `${getRankColor(player.rank)}20`,
                            color: getRankColor(player.rank),
                          }}
                        >
                          {player.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-bold text-sm truncate">{player.displayName || player.username}</p>
                      <p className="text-xs text-muted-foreground">Lv. {player.level}</p>
                      <p className="text-lg font-bold mt-2" style={{ color: getRankColor(player.rank) }}>
                        {player.xp.toLocaleString()} XP
                      </p>
                      <div className="mt-2">
                        <Badge variant="neon" className="text-xs">
                          {getRankForXP(player.xp)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Full leaderboard */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  {t.leaderboard.globalRankings}
                </div>
                <span className="text-sm font-normal text-muted-foreground">
                  <Users className="h-4 w-4 inline mr-1" />
                  {total.toLocaleString()} {t.common.players}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {players.map((player, i) => {
                  const rank = i + 1;
                  return (
                    <div
                      key={player.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-8 text-center">
                        {rank <= 3 ? (
                          <Medal
                            className="h-5 w-5 mx-auto"
                            style={{ color: rank === 1 ? "#ffd700" : rank === 2 ? "#c0c0c0" : "#cd7f32" }}
                          />
                        ) : (
                          <span className="text-sm font-bold text-muted-foreground">
                            {rank}
                          </span>
                        )}
                      </div>

                      <Avatar className="h-10 w-10">
                        <AvatarFallback
                          className="text-sm font-bold"
                          style={{
                            backgroundColor: `${getRankColor(player.rank)}20`,
                            color: getRankColor(player.rank),
                          }}
                        >
                          {player.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">
                            {player.displayName || player.username}
                          </p>
                          {player.country && <span className="text-sm">{player.country}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Level {player.level} · {getRankForXP(player.xp)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold neon-text">{player.xp.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">XP</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {players.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t.leaderboard.noPlayers}</h3>
                  <p className="text-muted-foreground">
                    {t.leaderboard.noPlayersDesc}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {total > 50 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {t.common.previous}
              </button>
              <span className="text-sm text-muted-foreground">
                {t.common.page} {page} {t.common.of} {Math.ceil(total / 50)}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(total / 50)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {t.common.next}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
