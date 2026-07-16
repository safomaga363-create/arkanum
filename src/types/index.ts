// ===========================
// User Types
// ===========================

export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";
export type UserRank =
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "DIAMOND"
  | "MASTER"
  | "LEGENDARY";

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
  role: UserRole;
  isPremium: boolean;
  premiumExpiry: string | null;
  xp: number;
  level: number;
  rank: UserRank;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  country: string | null;
  bio: string | null;
  createdAt: string;
}

// ===========================
// Challenge Types
// ===========================

export type Difficulty = "EASY" | "MEDIUM" | "HARD" | "EXPERT" | "LEGENDARY";
export type ProgressStatus = "IN_PROGRESS" | "SOLVED" | "FAILED" | "SKIPPED";

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  color: string;
  difficulty: Difficulty;
  lessonCount?: number;
}

export type LessonType = "TEXT" | "VIDEO" | "INTERACTIVE" | "QUIZ" | "PRACTICAL";

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  contentType: LessonType;
  difficulty: Difficulty;
  durationMin: number;
  points: number;
  xpReward: number;
  sortOrder: number;
  learningPathId: string;
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  difficulty: Difficulty;
  category: string;
  points: number;
  xpReward: number;
  timeLimitMin: number | null;
  isFree: boolean;
  entryFee: number;
  learningPathId: string | null;
}

// ===========================
// Contest Types
// ===========================

export type ContestStatus =
  | "DRAFT"
  | "UPCOMING"
  | "ACTIVE"
  | "FINISHED"
  | "CANCELLED";
export type EntryStatus =
  | "PENDING"
  | "PAID"
  | "ACTIVE"
  | "COMPLETED"
  | "REFUNDED";

export interface Contest {
  id: string;
  title: string;
  slug: string;
  description: string;
  rules: string | null;
  prizePool: number;
  entryFee: number;
  commission: number;
  difficulty: Difficulty;
  maxParticipants: number | null;
  currentParticipants: number;
  status: ContestStatus;
  startDate: string;
  endDate: string;
  duration: number;
  prizes: string | null;
  isFeatured: boolean;
  createdAt: string;
}

export interface ContestEntry {
  id: string;
  userId: string;
  contestId: string;
  score: number;
  rank: number | null;
  prize: number;
  status: EntryStatus;
  paidAt: string;
}

// ===========================
// Payment Types
// ===========================

export type PaymentType =
  | "CONTEST_ENTRY"
  | "PREMIUM_SUBSCRIPTION"
  | "CHALLENGE_ENTRY"
  | "DEPOSIT"
  | "WITHDRAWAL";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type WithdrawalStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "REJECTED";

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  network: string;
  type: PaymentType;
  status: PaymentStatus;
  txHash: string | null;
  externalId: string | null;
  description: string | null;
  contestId: string | null;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  network: string;
  wallet: string;
  status: WithdrawalStatus;
  txHash: string | null;
  notes: string | null;
  createdAt: string;
}

// ===========================
// Dashboard Types
// ===========================

export interface DashboardStats {
  totalUsers: number;
  activeContests: number;
  totalRevenue: number;
  pendingWithdrawals: number;
  recentPayments: Payment[];
  topPlayers: User[];
}

// ===========================
// API Response Types
// ===========================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
