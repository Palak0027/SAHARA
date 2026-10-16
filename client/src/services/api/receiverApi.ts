import { http } from "./http";
import { CategoryItem, DonationItem, DonationLocation } from "./donorApi";

export interface NeedLocation {
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  coordinates?: {
    lat: number | null;
    lng: number | null;
  };
}

export interface OnBehalfOfData {
  isOnBehalf: boolean;
  beneficiaryName?: string;
  beneficiaryAge?: number | null;
  relationship?: string;
  beneficiaryLocation?: string;
}

export interface ReceiverNeedItem {
  _id: string;
  receiverId: {
    _id: string;
    name: string;
    phone?: string;
    email?: string;
    receiverType?: string;
    organization?: {
      orgName?: string;
      regNumber?: string;
      verificationStatus?: string;
    };
    location?: NeedLocation;
  } | string;
  title: string;
  categoryId: CategoryItem | { _id: string; name: string; description?: string };
  quantity: number;
  unit: string;
  urgency: "low" | "medium" | "high" | "critical";
  requiredBy: string;
  description: string;
  location: NeedLocation;
  receiverType?: "individual" | "family" | "community" | "organization" | string;
  onBehalfOf?: OnBehalfOfData;
  deliveryPreference?: "volunteer_delivery" | "donor_dropoff" | "receiver_pickup" | "any";
  matchedWith?: string;
  fulfillmentDetails?: {
    mode: "volunteer_delivery" | "donor_dropoff" | "receiver_pickup";
    matchedAt: string;
    notes?: string;
  };
  status: "open" | "matched" | "accepted" | "in_transit" | "fulfilled" | "cancelled";
  createdAt: string;
  updatedAt?: string;
}

export type LogisticsMode = "volunteer_delivery" | "donor_dropoff" | "receiver_pickup";
export type DeliveryPreference = LogisticsMode | "any";

export interface ReceiverSmartMatchItem {
  matchId: string;
  score: number;
  need: {
    _id: string;
    title: string;
    quantity: number;
    unit: string;
    urgency: string;
    category?: string;
    location?: NeedLocation;
    requiredBy?: string;
  };
  donation: {
    _id: string;
    title: string;
    quantity: number;
    unit: string;
    category?: string;
    donorName?: string;
    location?: DonationLocation;
    availableUntil?: string;
    foodDetails?: any;
  };
  logistics: {
    recommendedMode: LogisticsMode;
    label: string;
    description: string;
  };
}

export interface ReceiverStats {
  totalNeeds: number;
  openCount: number;
  inProgressCount: number;
  fulfilledCount: number;
  cancelledCount: number;
  totalItemsRequested: number;
}

export interface UrgencyDistribution {
  _id: string;
  count: number;
}

export interface ReceiverDashboardResponse {
  success: boolean;
  stats: ReceiverStats;
  urgencyDistribution: UrgencyDistribution[];
  categoryDistribution: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
    totalQuantity: number;
  }>;
  recentNeeds: ReceiverNeedItem[];
}

export interface CreateNeedPayload {
  title: string;
  categoryId: string;
  quantity: number;
  unit: string;
  urgency: "low" | "medium" | "high" | "critical";
  requiredBy: string;
  description: string;
  location: {
    address: string;
    city: string;
    state?: string;
    pincode?: string;
  };
  deliveryPreference?: DeliveryPreference;
  receiverType?: string;
  onBehalfOf?: OnBehalfOfData;
}

export const receiverApi = {
  getDashboard: () =>
    http.get<ReceiverDashboardResponse>("/api/needs/dashboard"),

  getMyNeeds: (params?: { status?: string; categoryId?: string; urgency?: string }) =>
    http.get<{ success: boolean; count: number; needs: ReceiverNeedItem[] }>("/api/needs/my", { params }),

  getNeedById: (id: string) =>
    http.get<{ success: boolean; need: ReceiverNeedItem }>(`/api/needs/${id}`),

  createNeed: (payload: CreateNeedPayload) =>
    http.post<{ success: boolean; message: string; need: ReceiverNeedItem }>("/api/needs", payload),

  updateNeed: (id: string, payload: Partial<CreateNeedPayload> & { status?: string }) =>
    http.patch<{ success: boolean; message: string; need: ReceiverNeedItem }>(`/api/needs/${id}`, payload),

  deleteNeed: (id: string) =>
    http.delete<{ success: boolean; message: string }>(`/api/needs/${id}`),

  getAvailableDonations: (params?: { categoryId?: string; city?: string; search?: string; page?: number; limit?: number }) =>
    http.get<{
      success: boolean;
      donations: DonationItem[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>("/api/donations", {
      params: { status: "available", ...params }
    }),

  getCategories: (status: string = "active") =>
    http.get<{ success: boolean; count: number; categories: CategoryItem[] }>("/api/categories", {
      params: { status }
    }),

  createCategory: (name: string, description?: string) =>
    http.post<{ success: boolean; message: string; category: CategoryItem }>("/api/categories", {
      name,
      description
    }),

  getSmartMatches: () =>
    http.get<{ success: boolean; count: number; matches: ReceiverSmartMatchItem[] }>("/api/matches/receiver"),

  confirmMatch: (payload: { donationId: string; needId: string; fulfillmentMode: LogisticsMode; notes?: string }) =>
    http.post<{ success: boolean; message: string; fulfillmentMode: LogisticsMode; task?: any }>("/api/matches/confirm", payload),
};

export default receiverApi;
