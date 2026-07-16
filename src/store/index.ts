import { create } from "zustand";
import type { User, Contest, DashboardStats } from "@/types";

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;

  activeContests: Contest[];
  setActiveContests: (contests: Contest[]) => void;

  dashboardStats: DashboardStats | null;
  setDashboardStats: (stats: DashboardStats) => void;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  activeContests: [],
  setActiveContests: (activeContests) => set({ activeContests }),

  dashboardStats: null,
  setDashboardStats: (dashboardStats) => set({ dashboardStats }),

  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  theme: "dark",
  setTheme: (theme) => set({ theme }),
}));
