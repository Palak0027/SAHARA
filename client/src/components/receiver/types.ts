import { ReceiverNeedItem } from "../../services/api/receiverApi";
import { DonationItem } from "../../services/api/donorApi";

export type ReceiverTab = "Overview" | "Find Donations" | "Raise Need" | "My Requests" | "Account";

export type NeedFilter = "All" | "open" | "in_progress" | "fulfilled" | "cancelled";

export interface ReceiverNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

export interface RequestPrefillDonation {
  donationId: string;
  title: string;
  categoryId?: string;
  categoryName?: string;
  quantity: number;
  unit: string;
  description: string;
}
