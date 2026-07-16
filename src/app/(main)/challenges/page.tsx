"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Zap,
  Target,
  Search,
  Filter,
  Lock,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";

const categories = [
  "All",
  "Web Security",
  "Cryptography",
  "Binary Exploitation",
  "Reverse Engineering",
  "Forensics",
  "Networking",
];

interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  category: string;
  points: number;
  xpReward: number;
  timeLimitMin: number | null;
  isFree: boolean;
  entryFee: number;
  learningPathId: string | null;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: "24",
    });
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (search) params.set("search", search);

    fetch(`/api/challenges?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setChallenges(data.data.items);
          setTotalPages(data.data.totalPages);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, search, page]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="neon-text">Challenges</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Sharpen your skills with real-world cybersecurity challenges.
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Challenges grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="glass animate-pulse">
              <CardContent className="p-5 h-48" />
            </Card>
          ))}
        </div>
      ) : challenges.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Challenges Found</h3>
            <p className="text-muted-foreground">
              {search ? "Try a different search term." : "Challenges will appear here once created."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge) => (
            <Link key={challenge.id} href={`/challenges/${challenge.slug}`}>
              <Card className="glass card-hover group h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: `${getDifficultyColor(challenge.difficulty)}40`,
                        color: getDifficultyColor(challenge.difficulty),
                      }}
                    >
                      {challenge.difficulty}
                    </Badge>
                    {!challenge.isFree && (
                      <Badge variant="warning" className="text-xs">
                        <Lock className="w-2 h-2 mr-1" />
                        ${challenge.entryFee}
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {challenge.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {challenge.points} pts
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-cyan-400" />
                      {challenge.xpReward} XP
                    </div>
                    {challenge.timeLimitMin && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {challenge.timeLimitMin}m
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                      {challenge.category}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
