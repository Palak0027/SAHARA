import type { LucideIcon } from "lucide-react";

export type Tab =
  | "Overview"
  | "Users"
  | "Verifications"
  | "Donations"
  | "Requests"
  | "Volunteers"
  | "Reports"
  | "Account";

export interface NavItem {
  label: Tab;
  icon: LucideIcon;
  badge?: number;
}
