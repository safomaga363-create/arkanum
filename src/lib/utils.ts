import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USDT"): string {
  return `${amount.toFixed(2)} ${currency}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
}

export function getRankColor(rank: string): string {
  const colors: Record<string, string> = {
    BRONZE: "#cd7f32",
    SILVER: "#c0c0c0",
    GOLD: "#ffd700",
    PLATINUM: "#00f0ff",
    DIAMOND: "#b9f2ff",
    MASTER: "#8b5cf6",
    LEGENDARY: "#ff6b6b",
  };
  return colors[rank] || "#00f0ff";
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    EASY: "#22c55e",
    MEDIUM: "#eab308",
    HARD: "#f97316",
    EXPERT: "#ef4444",
    LEGENDARY: "#8b5cf6",
  };
  return colors[difficulty] || "#00f0ff";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function calculateCommission(amount: number, percent: number): number {
  return amount * (percent / 100);
}

export function calculateNet(amount: number, commissionPercent: number): number {
  return amount - calculateCommission(amount, commissionPercent);
}
