 

const BASE_URL: string = (import.meta as any).env?.VITE_API_URL || "/api";
 
const getToken = () => localStorage.getItem("token");

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    
  }

  if (!res.ok) {
    throw new Error(json?.message || json?.error || `Request failed (${res.status})`);
  }
  
  return (json?.data ?? json) as T;
}

export type Category = { _id: string; name: string };

export type FoodDetails = { preparedOn: string; safeUntil: string; isVeg: boolean };

export type DonationPayload = {
  title: string;
  categoryId: string;
  quantity: number;
  unit: string;
  description: string;
  location: { address: string; city: string; state: string; pincode: string };
  availableFrom: string;
  availableUntil: string;
  foodDetails?: FoodDetails;
};

export const getCategories = () => request<Category[]>("/categories");
export const addCategory = (name: string) =>
  request<Category>("/categories", { method: "POST", body: JSON.stringify({ name }) });

export const createDonation = (payload: DonationPayload) =>
  request("/donations", { method: "POST", body: JSON.stringify(payload) });

export const getDashboard = () => request<any>("/donations/dashboard");

export const getMyDonations = (status?: string) =>
  request<any>(`/donations/my${status ? `?status=${encodeURIComponent(status)}` : ""}`);

export const updateDonation = (id: string, payload: Partial<DonationPayload>) =>
  request(`/donations/${id}`, { method: "PATCH", body: JSON.stringify(payload) });

export const deleteDonation = (id: string) => request(`/donations/${id}`, { method: "DELETE" });