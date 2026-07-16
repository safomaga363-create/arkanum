import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

const footerLinks = {
  Platform: [
    { href: "/learning-paths", label: "Learning Paths" },
    { href: "/challenges", label: "Challenges" },
    { href: "/contests", label: "Contests" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/wallet", label: "Wallet" },
    { href: "/premium", label: "Premium" },
  ],
  Legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/ethics", label: "Ethics Policy" },
  ],
  Support: [
    { href: "/help", label: "Help Center" },
    { href: "/contact", label: "Contact Us" },
    { href: "/status", label: "System Status" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-wider">
                <span className="neon-text">AR</span>
                <span className="text-foreground">KA</span>
                <span className="neon-text-purple">NUM</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium ethical hacking arena. Master cybersecurity skills in a
              safe, gamified environment.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ARKANUM. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            All systems operational
          </div>
          <p className="text-xs text-muted-foreground">
            White-hat hacking only. 18+ required.
          </p>
        </div>
      </div>
    </footer>
  );
}
