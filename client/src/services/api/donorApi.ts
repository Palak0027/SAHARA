import { http } from "./http";

export interface CategoryItem {
  _id: string;
  name: string;
  description?: string;
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface DonationLocation {
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  coordinates?: {
    lat: number | null;
    lng: number | null;
  };
}

export interface FoodDetails {
  preparedOn?: string | null;
  safeUntil?: string | null;
  isVeg: boolean;
}

export interface DonationItem {
  _id: string;
  donorId?: {
    _id: string;
    name: string;
    phone?: string;
    email?: string;
    location?: DonationLocation;
  } | string;
  title: string;
  categoryId: CategoryItem | { _id: string; name: string; description?: string };
  quantity: number;
  unit: string;
  description: string;
  location: DonationLocation;
  availableFrom: string;
  availableUntil: string;
  foodDetails?: FoodDetails | null;
  deliveryPreference?: "volunteer_delivery" | "donor_dropoff" | "receiver_pickup" | "any";
  matchedWith?: string;
  fulfillmentDetails?: {
    mode: "volunteer_delivery" | "donor_dropoff" | "receiver_pickup";
    matchedAt: string;
    notes?: string;
  };
  status: "available" | "matched" | "accepted" | "in_transit" | "completed" | "cancelled";
  images?: string[];
  createdAt: string;
  updatedAt?: string;
}

export type LogisticsMode = "volunteer_delivery" | "donor_dropoff" | "receiver_pickup";
export type DeliveryPreference = LogisticsMode | "any";

export interface SmartMatchItem {
  matchId: string;
  score: number;
  donation: {
    _id: string;
    title: string;
    quantity: number;
    unit: string;
    category?: string;
    location?: DonationLocation;
    availableUntil?: string;
  };
  need: {
    _id: string;
    title: string;
    quantity: number;
    unit: string;
    urgency: "low" | "medium" | "high" | "critical";
    category?: string;
    receiverName?: string;
    receiverType?: string;
    organization?: string;
    location?: DonationLocation;
    requiredBy?: string;
  };
  logistics: {
    recommendedMode: LogisticsMode;
    label: string;
    description: string;
  };
}

export interface ConfirmMatchPayload {
  donationId: string;
  needId: string;
  fulfillmentMode: LogisticsMode;
  notes?: string;
}

export interface DonorStats {
  totalDonations: number;
  availableCount: number;
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
  totalItemsDonated: number;
  estimatedPeopleImpacted: number;
}

export interface CategoryDistribution {
  categoryId: string;
  categoryName: string;
  count: number;
  totalQuantity: number;
}

export interface DonorDashboardResponse {
  success: boolean;
  stats: DonorStats;
  categoryDistribution: CategoryDistribution[];
  recentDonations: DonationItem[];
}

export interface CreateDonationPayload {
  title: string;
  categoryId: string;
  quantity: number;
  unit: string;
  description: string;
  location: {
    address: string;
    city: string;
    state?: string;
    pincode?: string;
  };
  availableFrom: string;
  availableUntil: string;
  deliveryPreference?: DeliveryPreference;
  foodDetails?: {
    preparedOn?: string | null;
    safeUntil?: string | null;
    isVeg?: boolean;
  } | null;
  images?: string[];
}

export interface CommunityNeed {
  _id: string;
  receiverId?: {
    _id: string;
    name: string;
    phone?: string;
    receiverType?: string;
    organization?: { orgName?: string };
    location?: DonationLocation;
  };
  title: string;
  categoryId?: { _id: string; name: string; description?: string };
  quantity: number;
  unit: string;
  urgency: "low" | "medium" | "high" | "critical";
  requiredBy: string;
  description: string;
  location: DonationLocation;
  status: "open" | "matched" | "accepted" | "in_transit" | "fulfilled" | "cancelled";
  receiverType?: string;
  onBehalfOf?: {
    isOnBehalf?: boolean;
    beneficiaryName?: string;
  };
  createdAt: string;
}

export interface MyImpactData {
  totalDonations: number;
  completedDonations: number;
  totalQuantityDonated: number;
  peopleHelped: number;
  mealsServed: number;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
    totalQuantity: number;
  }>;
}

export const donorApi = {
  getDashboard: () =>
    http.get<DonorDashboardResponse>("/api/donations/dashboard"),

  getMyDonations: (params?: { status?: string; categoryId?: string }) =>
    http.get<{ success: boolean; count: number; donations: DonationItem[] }>("/api/donations/my", { params }),

  getDonationById: (id: string) =>
    http.get<{ success: boolean; donation: DonationItem }>(`/api/donations/${id}`),

  createDonation: (payload: CreateDonationPayload) =>
    http.post<{ success: boolean; message: string; donation: DonationItem }>("/api/donations", payload),

  updateDonation: (id: string, payload: Partial<CreateDonationPayload> & { status?: string }) =>
    http.patch<{ success: boolean; message: string; donation: DonationItem }>(`/api/donations/${id}`, payload),

  deleteDonation: (id: string) =>
    http.delete<{ success: boolean; message: string }>(`/api/donations/${id}`),

  getCategories: (status: string = "active") =>
    http.get<{ success: boolean; count: number; categories: CategoryItem[] }>("/api/categories", {
      params: { status }
    }),

  createCategory: (name: string, description?: string) =>
    http.post<{ success: boolean; message: string; category: CategoryItem }>("/api/categories", {
      name,
      description
    }),

  getCommunityNeeds: (params?: { status?: string; categoryId?: string; urgency?: string; page?: number; limit?: number }) =>
    http.get<{
      success: boolean;
      needs: CommunityNeed[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>("/api/needs", { params }),

  getMyImpact: () =>
    http.get<{ success: boolean; impact: MyImpactData }>("/api/impact/my"),

  getGlobalImpact: () =>
    http.get<{ success: boolean; impact: any }>("/api/impact"),

  getSmartMatches: () =>
    http.get<{ success: boolean; count: number; matches: SmartMatchItem[] }>("/api/matches/donor"),

  confirmMatch: (payload: ConfirmMatchPayload) =>
    http.post<{ success: boolean; message: string; fulfillmentMode: LogisticsMode; task?: any }>("/api/matches/confirm", payload),
};

export default donorApi;
