"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Settings,
  Shield,
  Edit3,
  LogOut,
  Mail,
} from "lucide-react";
import { getRankColor } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const user = session?.user;
  const rankColor = user?.rank ? getRankColor(user.rank) : "#00f0ff";

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">
          {t.profile.title} <span className="neon-text">{t.profile.settings}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          {t.profile.subtitle}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="glass lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${rankColor}15` }}
            >
              <User className="h-10 w-10" style={{ color: rankColor }} />
            </div>
            <h2 className="text-xl font-bold">{user?.displayName || user?.username || "User"}</h2>
            <p className="text-sm text-muted-foreground">@{user?.username || "username"}</p>
            <Badge variant="neon" className="mt-2">
              {user?.rank || "BRONZE"}
            </Badge>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {user?.email || "user@example.com"}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Settings className="h-4 w-4" />
                {t.profile.level} {user?.level || 1} · {(user?.xp || 0).toLocaleString()} XP
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings forms */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-primary" />
                {t.profile.editProfile}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.profile.displayName}</label>
                  <Input placeholder={user?.displayName || ""} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.profile.username}</label>
                  <Input placeholder={user?.username || ""} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.profile.bio}</label>
                <Input placeholder={t.profile.bioPlaceholder} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.profile.website}</label>
                <Input placeholder={t.profile.websitePlaceholder} />
              </div>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                {t.profile.saveChanges}
              </Button>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {t.profile.security}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.profile.currentPassword}</label>
                <Input type="password" placeholder={t.profile.currentPasswordPlaceholder} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.profile.newPassword}</label>
                  <Input type="password" placeholder={t.profile.newPasswordPlaceholder} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.profile.confirmPassword}</label>
                  <Input type="password" placeholder={t.profile.confirmPasswordPlaceholder} />
                </div>
              </div>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                {t.profile.updatePassword}
              </Button>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <LogOut className="h-5 w-5" />
                {t.profile.signOut}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/" })}>
                {t.profile.signOutDesc}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
