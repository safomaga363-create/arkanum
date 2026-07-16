"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Zap,
  Swords,
  Trophy,
  Crown,
  BookOpen,
  Wallet,
  Settings,
  LogOut,
  Shield,
  ChevronLeft,
  Bell,
} from "lucide-react";
import { getRankColor } from "@/lib/utils";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learning-paths", label: "Learning Paths", icon: BookOpen },
  { href: "/challenges", label: "Challenges", icon: Zap },
  { href: "/contests", label: "Contests", icon: Swords },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/premium", label: "Premium", icon: Crown },
  { href: "/profile", label: "Profile", icon: Settings },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = React.useState(false);

  const user = session?.user;
  const userInitials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "A";
  const rankColor = user?.rank ? getRankColor(user.rank) : "#00f0ff";

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 glass-strong border-r border-border transition-all duration-300 flex flex-col",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-wider">
                <span className="neon-text">AR</span>
                <span className="text-foreground">KA</span>
                <span className="neon-text-purple">NUM</span>
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <link.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-border">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <Avatar className="h-9 w-9">
              <AvatarFallback
                className="text-sm font-bold"
                style={{ backgroundColor: `${rankColor}20`, color: rankColor }}
              >
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.displayName || user?.username || "User"}
                </p>
                <p className="text-xs truncate" style={{ color: rankColor }}>
                  {user?.rank || "BRONZE"} · {(user?.xp || 0).toLocaleString()} XP
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "ml-[72px]" : "ml-64"
        )}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 glass-strong border-b border-border flex items-center justify-between px-6">
          <div />
          <div className="flex items-center gap-3">
            <Badge variant="neon" className="hidden sm:inline-flex">
              <Wallet className="w-3 h-3 mr-1" />
              {(user?.balance || 0).toFixed(2)} USDT
            </Badge>
            <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
