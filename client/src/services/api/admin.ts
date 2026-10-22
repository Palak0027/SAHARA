import { http } from "./http";

export interface AdminStatsResponse {
  success: boolean;
  stats: {
    users: {
      total: number;
      donors: number;
      receivers: number;
      volunteers: number;
      active: number;
      blocked: number;
    };
    donations: {
      total: number;
      available: number;
      completed: number;
    };
    needs: {
      total: number;
      open: number;
      critical: number;
      fulfilled: number;
    };
    verifications: {
      pending: number;
    };
    volunteers: {
      active: number;
    };
    tasks: {
      total: number;
    };
    recentActivity: {
      users: any[];
      donations: any[];
      needs: any[];
    };
  };
}

export interface AdminUsersResponse {
  success: boolean;
  users: Array<{
    _id: string;
    name: string;
    phone: string;
    email?: string;
    role: string;
    roles?: string[];
    isActive: boolean;
    location?: {
      address?: string;
      city?: string;
      state?: string;
    };
    organization?: {
      orgName?: string;
      verificationStatus?: string;
    };
    createdAt: string;
  }>;
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminVerificationsResponse {
  success: boolean;
  organizations: Array<{
    _id: string;
    name: string;
    phone: string;
    email?: string;
    location?: {
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
    };
    organization: {
      orgName: string;
      regNumber: string;
      description?: string;
      verificationStatus: "pending" | "verified" | "rejected";
      rejectionReason?: string;
    };
    createdAt: string;
  }>;
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminDonationsResponse {
  success: boolean;
  donations: Array<{
    _id: string;
    title: string;
    quantity: number;
    unit: string;
    category?: string;
    categoryId?: { _id: string; name: string };
    donorId?: { _id: string; name: string; phone: string; location?: any };
    location?: { address?: string; city?: string };
    status: "available" | "matched" | "accepted" | "in_transit" | "completed" | "cancelled";
    foodDetails?: {
      isVeg?: boolean;
      safeUntil?: string;
    };
    createdAt: string;
  }>;
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminNeedsResponse {
  success: boolean;
  needs: Array<{
    _id: string;
    title: string;
    quantity: number;
    unit: string;
    urgency: "low" | "medium" | "high" | "critical";
    categoryId?: { _id: string; name: string };
    receiverId?: {
      _id: string;
      name: string;
      phone: string;
      receiverType?: string;
      organization?: { orgName?: string };
    };
    location?: { address?: string; city?: string };
    status: "open" | "matched" | "accepted" | "in_transit" | "fulfilled" | "cancelled";
    createdAt: string;
  }>;
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminVolunteersResponse {
  success: boolean;
  count: number;
  volunteers: Array<{
    _id: string;
    name: string;
    phone: string;
    email?: string;
    isActive: boolean;
    location?: { city?: string; address?: string };
    volunteerDetails?: {
      availability: boolean;
      vehicleType: string;
    };
    activeTasksCount?: number;
    createdAt: string;
  }>;
}

export interface AdminTasksResponse {
  success: boolean;
  tasks: Array<{
    _id: string;
    title: string;
    description: string;
    taskType: string;
    status: "available" | "assigned" | "in_progress" | "completed" | "cancelled";
    urgency: string;
    scheduledTime: string;
    peopleNeeded: number;
    location?: { address?: string; city?: string };
    volunteerId?: { _id: string; name: string; phone: string };
    donationId?: { _id: string; title: string };
    needId?: { _id: string; title: string; urgency: string };
    createdAt: string;
  }>;
  total: number;
}

export interface CreateVolunteerPayload {
  name: string;
  phone: string;
  email?: string;
  password: string;
  location?: {
    city?: string;
    address?: string;
    state?: string;
    pincode?: string;
  };
  vehicleType?: string;
  availability?: boolean;
}

export const adminApi = {
  getStats: () => http.get<AdminStatsResponse>("/api/admin/stats"),

  getUsers: (params?: { role?: string; status?: string; search?: string; page?: number; limit?: number }) =>
    http.get<AdminUsersResponse>("/api/admin/users", { params }),

  toggleUserStatus: (id: string, isActive: boolean) =>
    http.patch<{ success: boolean; message: string }>(`/api/admin/users/${id}/status`, { isActive }),

  getUserDetails: (id: string) =>
    http.get<{ success: boolean; data: any }>(`/api/admin/users/${id}`),

  getVerifications: (params?: { status?: string; page?: number; limit?: number }) =>
    http.get<AdminVerificationsResponse>("/api/admin/verifications", { params }),

  updateVerification: (id: string, payload: { status: "verified" | "rejected"; rejectionReason?: string }) =>
    http.patch<{ success: boolean; message: string }>(`/api/admin/verifications/${id}`, payload),

  getDonations: (params?: { status?: string; categoryId?: string; search?: string; page?: number; limit?: number }) =>
    http.get<AdminDonationsResponse>("/api/admin/donations", { params }),

  updateDonationStatus: (id: string, status: string) =>
    http.patch<{ success: boolean; message: string }>(`/api/admin/donations/${id}/status`, { status }),

  getNeeds: (params?: { status?: string; urgency?: string; search?: string; page?: number; limit?: number }) =>
    http.get<AdminNeedsResponse>("/api/admin/needs", { params }),

  updateNeedStatus: (id: string, status: string) =>
    http.patch<{ success: boolean; message: string }>(`/api/admin/needs/${id}/status`, { status }),

  getVolunteers: () =>
    http.get<AdminVolunteersResponse>("/api/admin/volunteers"),

  createVolunteer: (payload: CreateVolunteerPayload) =>
    http.post<{ success: boolean; message: string; volunteer: any }>("/api/admin/volunteers", payload),

  dispatchTask: (payload: {
    title: string;
    description?: string;
    donationId?: string;
    needId?: string;
    volunteerId?: string;
    scheduledTime?: string;
    urgency?: string;
    location?: any;
    peopleNeeded?: number;
  }) => http.post<{ success: boolean; message: string; task: any }>("/api/admin/dispatch", payload),

  getTasks: (params?: { status?: string; page?: number; limit?: number }) =>
    http.get<AdminTasksResponse>("/api/admin/tasks", { params }),

  getContactMessages: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    http.get<AdminContactMessagesResponse>("/api/contact", { params }),

  updateContactStatus: (id: string, payload: { status?: "unread" | "read" | "resolved"; adminNotes?: string }) =>
    http.patch<{ success: boolean; message: string; data: ContactMessageItem }>(`/api/contact/${id}`, payload),

  deleteContactMessage: (id: string) =>
    http.delete<{ success: boolean; message: string }>(`/api/contact/${id}`)
};

export interface ContactMessageItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "resolved";
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminContactMessagesResponse {
  success: boolean;
  total: number;
  unreadCount: number;
  page: number;
  messages: ContactMessageItem[];
}

