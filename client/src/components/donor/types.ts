import { DonationItem, CommunityNeed } from "../../services/api/donorApi";

export type DonorTab = "Overview" | "Post Donation" | "My Donations" | "Requests" | "Account";

export type DonationFilter = "All" | "available" | "in_progress" | "completed" | "cancelled";

export interface NeedPrefillData {
  needId: string;
  title: string;
  categoryId?: string;
  categoryName?: string;
  quantity: number;
  unit: string;
  description: string;
}

export interface DonorNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning";
  read: boolean;
}
