import React, { useState } from "react";
import {
  Bell,
  ChevronDown,
  Heart,
  HeartHandshake,
  Home,
  Package,
  Plus,
  Settings,
  User,
  Utensils,
  Shirt,
  Clock,
  CheckCircle2,
  Menu,
  X,
  LogOut,
  Users,
  ArrowUpRight,
  Eye,
  Check,
  XCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

type DonationStatus = "Active" | "Completed";

type Donation = {
  id: number;
  type: "Food" | "Clothes";
  title: string;
  description: string;
  quantity: string;
  requests: number;
  status: DonationStatus;
  icon: React.ReactNode;
  bg: string;
};

type RequestStatus = "Pending" | "Approved" | "Completed" | "Rejected";

type DonationRequest = {
  id: number;
  item: string;
  receiver: string;
  status: RequestStatus;
  date: string;
};

type Tab =
  | "Overview"
  | "Post Donation"
  | "My Donations"
  | "Requests"
  | "Profile"
  | "Settings";

export default function DonatorDashboard() {
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const [donations, setDonations] = useState<Donation[]>([
    {
      id: 1,
      type: "Food",
      title: "Grocery Essentials",
      description:
        "Rice, flour, sugar and other grocery items available for donation.",
      quantity: "5 items",
      requests: 2,
      status: "Active",
      icon: <Utensils className="h-6 w-6" />,
      bg: "bg-[#FFF2E9]",
    },
    {
      id: 2,
      type: "Clothes",
      title: "Winter Clothes",
      description:
        "Clean and gently-used winter clothes for adults and children.",
      quantity: "8 items",
      requests: 3,
      status: "Active",
      icon: <Shirt className="h-6 w-6" />,
      bg: "bg-[#EDF5EF]",
    },
    {
      id: 3,
      type: "Food",
      title: "Packed Meals",
      description:
        "Freshly prepared meals available for nearby families.",
      quantity: "10 meals",
      requests: 1,
      status: "Completed",
      icon: <Utensils className="h-6 w-6" />,
      bg: "bg-[#FFF2E9]",
    },
  ]);

  const [requests, setRequests] = useState<DonationRequest[]>([
    {
      id: 1,
      item: "Grocery Essentials",
      receiver: "Nearby Family",
      status: "Pending",
      date: "Today",
    },
    {
      id: 2,
      item: "Winter Clothes",
      receiver: "Local Resident",
      status: "Approved",
      date: "Yesterday",
    },
    {
      id: 3,
      item: "Packed Meals",
      receiver: "Community Member",
      status: "Completed",
      date: "24 Sep 2026",
    },
  ]);

  const [selectedDonation, setSelectedDonation] =
    useState<Donation | null>(null);

  const [selectedRequest, setSelectedRequest] =
    useState<DonationRequest | null>(null);

  const [showNotifications, setShowNotifications] = useState(false);

  const [form, setForm] = useState({
    type: "Food",
    title: "",
    description: "",
    quantity: "",
  });

  const navigateTab = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handlePostDonation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.quantity) {
      return;
    }

    const newDonation: Donation = {
      id: Date.now(),
      type: form.type as "Food" | "Clothes",
      title: form.title,
      description: form.description,
      quantity: form.quantity,
      requests: 0,
      status: "Active",
      icon:
        form.type === "Food" ? (
          <Utensils className="h-6 w-6" />
        ) : (
          <Shirt className="h-6 w-6" />
        ),
      bg:
        form.type === "Food"
          ? "bg-[#FFF2E9]"
          : "bg-[#EDF5EF]",
    };

    setDonations((prev) => [newDonation, ...prev]);

    setForm({
      type: "Food",
      title: "",
      description: "",
      quantity: "",
    });

    setActiveTab("My Donations");
  };

  const handleRequestAction = (
    id: number,
    status: "Approved" | "Rejected"
  ) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, status }
          : request
      )
    );

    setSelectedRequest(null);
  };

  const totalDonations = donations.length;
  const completedDonations = donations.filter(
    (donation) => donation.status === "Completed"
  ).length;
  const pendingRequests = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const userName = user?.name || "User";

  const navigation: {
    name: Tab;
    icon: React.ReactNode;
  }[] = [
    {
      name: "Overview",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Post Donation",
      icon: <Plus className="h-5 w-5" />,
    },
    {
      name: "My Donations",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Requests",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#26332F]">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#DDE5DF] bg-[#FAF8F3] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-[#E3E9E4] px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F5547] text-white">
              <HeartHandshake className="h-5 w-5" />
            </div>

            <div>
              <h1 className="font-heading text-xl font-bold text-[#2F5547]">
                SAHARA
              </h1>

              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#71817A]">
                Community Care
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-[#71817A] lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-[#9AA8A0]">
            Dashboard
          </p>

          <div className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => navigateTab(item.name)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  activeTab === item.name
                    ? "bg-[#E5F0E8] text-[#2F5547]"
                    : "text-[#71817A] hover:bg-white hover:text-[#2F5547]"
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </div>

          <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-widest text-[#9AA8A0]">
            Account
          </p>

          <div className="space-y-1">
            <button
              onClick={() => navigateTab("Profile")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                activeTab === "Profile"
                  ? "bg-[#E5F0E8] text-[#2F5547]"
                  : "text-[#71817A] hover:bg-white hover:text-[#2F5547]"
              }`}
            >
              <User className="h-5 w-5" />
              Profile
            </button>

            <button
              onClick={() => navigateTab("Settings")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                activeTab === "Settings"
                  ? "bg-[#E5F0E8] text-[#2F5547]"
                  : "text-[#71817A] hover:bg-white hover:text-[#2F5547]"
              }`}
            >
              <Settings className="h-5 w-5" />
              Settings
            </button>
          </div>
        </div>

        {/* User */}
        <div className="border-t border-[#E3E9E4] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDE9DF] text-sm font-bold text-[#2F5547]">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#26332F]">
                {userName}
              </p>

              <p className="truncate text-xs text-[#8A9890]">
                Donator
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-lg p-1.5 text-[#8A9890] transition hover:bg-[#FDECEC] hover:text-red-500"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="lg:pl-64">

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#E1E7E2] bg-[#F7F8F5]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-[#D9E1DB] bg-white p-2.5 text-[#2F5547] lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <p className="text-xs font-medium text-[#8A9890]">
                Donator Dashboard
              </p>

              <h2 className="font-heading text-lg font-bold text-[#26332F] sm:text-xl">
                Welcome back, {userName.split(" ")[0]} 👋
              </h2>
            </div>
          </div>

          <div className="relative flex items-center gap-3">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative rounded-xl border border-[#D9E1DB] bg-white p-2.5 text-[#607068] transition hover:text-[#2F5547]"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />

              {pendingRequests > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#4F7C68]" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-14 z-50 w-72 rounded-2xl border border-[#DDE6DF] bg-white p-4 shadow-xl">
                <h4 className="font-semibold text-[#26332F]">
                  Notifications
                </h4>

                <p className="mt-2 text-sm text-[#71817A]">
                  You have {pendingRequests} pending donation request
                  {pendingRequests !== 1 ? "s" : ""}.
                </p>
              </div>
            )}

            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DDE9DF] text-sm font-bold text-[#2F5547]">
                {userName.charAt(0).toUpperCase()}
              </div>

              <ChevronDown className="h-4 w-4 text-[#71817A]" />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">

          {/* ================= OVERVIEW ================= */}
          {activeTab === "Overview" && (
            <>
              <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm text-[#71817A]">
                    Make a difference by sharing what you can with your
                    community.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("Post Donation")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F7C68] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3E6856]"
                >
                  <Plus className="h-4 w-4" />
                  Post Donation
                </button>
              </div>

              {/* Statistics */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDF5EF] text-[#4F7C68]">
                      <Package className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#6E8C7A]" />
                  </div>

                  <p className="font-heading text-3xl font-bold text-[#26332F]">
                    {totalDonations}
                  </p>

                  <p className="mt-1 text-sm text-[#71817A]">
                    Total donations
                  </p>
                </div>

                <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF2E9] text-[#C8794D]">
                      <Users className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#6E8C7A]" />
                  </div>

                  <p className="font-heading text-3xl font-bold text-[#26332F]">
                    {donations.reduce(
                      (sum, donation) => sum + donation.requests,
                      0
                    )}
                  </p>

                  <p className="mt-1 text-sm text-[#71817A]">
                    People reached
                  </p>
                </div>

                <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDF5EF] text-[#4F7C68]">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>

                    <span className="text-xs font-medium text-[#6E8C7A]">
                      Completed
                    </span>
                  </div>

                  <p className="font-heading text-3xl font-bold text-[#26332F]">
                    {completedDonations}
                  </p>

                  <p className="mt-1 text-sm text-[#71817A]">
                    Successful donations
                  </p>
                </div>

                <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2EEE6] text-[#8B7657]">
                      <Clock className="h-5 w-5" />
                    </div>

                    <span className="text-xs font-medium text-[#8B7657]">
                      Action needed
                    </span>
                  </div>

                  <p className="font-heading text-3xl font-bold text-[#26332F]">
                    {pendingRequests}
                  </p>

                  <p className="mt-1 text-sm text-[#71817A]">
                    Pending requests
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 overflow-hidden rounded-2xl bg-[#2F5547] p-6 text-white sm:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                      <Heart className="h-5 w-5" />
                    </div>

                    <h3 className="font-heading text-2xl font-bold">
                      Have something to give?
                    </h3>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-[#C8D9CE]">
                      Share food, clothes or useful items with someone nearby
                      who needs them.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("Post Donation")}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#2F5547] transition hover:bg-[#F1F6F2]"
                  >
                    <Plus className="h-4 w-4" />
                    Create Donation
                  </button>
                </div>
              </div>

              {/* Recent Donations */}
              <section className="mt-10">
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                      Your activity
                    </p>

                    <h3 className="mt-1 font-heading text-2xl font-bold text-[#26332F]">
                      My Donations
                    </h3>
                  </div>

                  <button
                    onClick={() => setActiveTab("My Donations")}
                    className="hidden text-sm font-semibold text-[#4F7C68] sm:block"
                  >
                    View all →
                  </button>
                </div>

                <DonationGrid
                  donations={donations}
                  onView={(donation) => setSelectedDonation(donation)}
                />
              </section>

              {/* Requests */}
              <section className="mt-10">
                <div className="mb-5">
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                    Incoming
                  </p>

                  <h3 className="mt-1 font-heading text-2xl font-bold text-[#26332F]">
                    Donation Requests
                  </h3>
                </div>

                <RequestList
                  requests={requests}
                  onReview={(request) => setSelectedRequest(request)}
                />
              </section>
            </>
          )}

          {/* ================= POST DONATION ================= */}
          {activeTab === "Post Donation" && (
            <section className="mx-auto max-w-3xl">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                  Share with your community
                </p>

                <h2 className="mt-1 font-heading text-3xl font-bold text-[#26332F]">
                  Post a Donation
                </h2>

                <p className="mt-2 text-sm text-[#71817A]">
                  Add details about the item you want to donate.
                </p>
              </div>

              <form
                onSubmit={handlePostDonation}
                className="rounded-2xl border border-[#DDE6DF] bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="grid gap-6">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#26332F]">
                      Donation Type
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            type: "Food",
                          }))
                        }
                        className={`rounded-xl border p-4 text-sm font-semibold transition ${
                          form.type === "Food"
                            ? "border-[#4F7C68] bg-[#EDF5EF] text-[#2F5547]"
                            : "border-[#DDE6DF] text-[#71817A] hover:bg-[#F7F8F5]"
                        }`}
                      >
                        🍱 Food
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            type: "Clothes",
                          }))
                        }
                        className={`rounded-xl border p-4 text-sm font-semibold transition ${
                          form.type === "Clothes"
                            ? "border-[#4F7C68] bg-[#EDF5EF] text-[#2F5547]"
                            : "border-[#DDE6DF] text-[#71817A] hover:bg-[#F7F8F5]"
                        }`}
                      >
                        👕 Clothes
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#26332F]">
                      Donation Title
                    </label>

                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="e.g. Grocery Essentials"
                      required
                      className="w-full rounded-xl border border-[#D9E1DB] px-4 py-3 text-sm outline-none transition placeholder:text-[#9AA8A1] focus:border-[#4F7C68] focus:ring-2 focus:ring-[#E5F0E8]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#26332F]">
                      Description
                    </label>

                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe what you are donating..."
                      required
                      rows={4}
                      className="w-full resize-none rounded-xl border border-[#D9E1DB] px-4 py-3 text-sm outline-none transition placeholder:text-[#9AA8A1] focus:border-[#4F7C68] focus:ring-2 focus:ring-[#E5F0E8]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#26332F]">
                      Quantity
                    </label>

                    <input
                      type="text"
                      value={form.quantity}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }))
                      }
                      placeholder="e.g. 5 items / 10 meals"
                      required
                      className="w-full rounded-xl border border-[#D9E1DB] px-4 py-3 text-sm outline-none transition placeholder:text-[#9AA8A1] focus:border-[#4F7C68] focus:ring-2 focus:ring-[#E5F0E8]"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button
                      type="submit"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4F7C68] px-5 py-3.5 font-semibold text-white transition hover:bg-[#3E6856]"
                    >
                      <Plus className="h-4 w-4" />
                      Publish Donation
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("Overview")}
                      className="rounded-xl border border-[#D9E1DB] px-5 py-3.5 font-semibold text-[#4F7C68] transition hover:bg-[#F1F6F2]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </section>
          )}

          {/* ================= MY DONATIONS ================= */}
          {activeTab === "My Donations" && (
            <section>
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                  Your activity
                </p>

                <h2 className="mt-1 font-heading text-3xl font-bold text-[#26332F]">
                  My Donations
                </h2>
              </div>

              <DonationGrid
                donations={donations}
                onView={(donation) => setSelectedDonation(donation)}
              />
            </section>
          )}

          {/* ================= REQUESTS ================= */}
          {activeTab === "Requests" && (
            <section>
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                  Incoming
                </p>

                <h2 className="mt-1 font-heading text-3xl font-bold text-[#26332F]">
                  Donation Requests
                </h2>
              </div>

              <RequestList
                requests={requests}
                onReview={(request) => setSelectedRequest(request)}
              />
            </section>
          )}

          {/* ================= PROFILE ================= */}
          {activeTab === "Profile" && (
            <section className="mx-auto max-w-3xl">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                  Account
                </p>

                <h2 className="mt-1 font-heading text-3xl font-bold text-[#26332F]">
                  Profile
                </h2>
              </div>

              <div className="rounded-2xl border border-[#DDE6DF] bg-white p-6 sm:p-8">
                <div className="flex items-center gap-4 border-b border-[#E8EDE9] pb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DDE9DF] text-xl font-bold text-[#2F5547]">
                    {userName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#26332F]">
                      {userName}
                    </h3>

                    <p className="text-sm text-[#71817A]">
                      Donator
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <ProfileField
                    label="Name"
                    value={user?.name || "Not available"}
                  />

                  <ProfileField
                    label="Phone"
                    value={user?.phone || "Not available"}
                  />

                  <ProfileField
                    label="Email"
                    value={user?.email || "Not available"}
                  />

                  <ProfileField
                    label="City"
                    value={user?.location?.city || "Not available"}
                  />
                </div>
              </div>
            </section>
          )}

          {/* ================= SETTINGS ================= */}
          {activeTab === "Settings" && (
            <section className="mx-auto max-w-3xl">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                  Account
                </p>

                <h2 className="mt-1 font-heading text-3xl font-bold text-[#26332F]">
                  Settings
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-[#DDE6DF] bg-white p-5">
                  <div>
                    <h3 className="font-semibold text-[#26332F]">
                      Notifications
                    </h3>

                    <p className="mt-1 text-sm text-[#71817A]">
                      Receive updates about your donation requests.
                    </p>
                  </div>

                  <div className="h-6 w-11 rounded-full bg-[#4F7C68] p-1">
                    <div className="ml-auto h-4 w-4 rounded-full bg-white" />
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-2xl border border-red-200 bg-white p-5 text-left text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">
                      Logout
                    </h3>
                    <p className="mt-1 text-sm text-red-400">
                      Sign out from your SAHARA account.
                    </p>
                  </div>
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* DONATION DETAILS MODAL */}
      {selectedDonation && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                  Donation Details
                </p>

                <h3 className="mt-1 text-2xl font-bold text-[#26332F]">
                  {selectedDonation.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedDonation(null)}
                className="rounded-lg p-2 text-[#71817A] hover:bg-[#F7F8F5]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-[#F7F8F5] p-4">
                <p className="text-xs uppercase tracking-wider text-[#8A9890]">
                  Description
                </p>

                <p className="mt-1 text-sm text-[#26332F]">
                  {selectedDonation.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#EDF5EF] p-4">
                  <p className="text-xs text-[#71817A]">
                    Quantity
                  </p>

                  <p className="mt-1 font-semibold text-[#2F5547]">
                    {selectedDonation.quantity}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FFF2E9] p-4">
                  <p className="text-xs text-[#71817A]">
                    Requests
                  </p>

                  <p className="mt-1 font-semibold text-[#C8794D]">
                    {selectedDonation.requests}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedDonation(null)}
              className="mt-6 w-full rounded-xl bg-[#4F7C68] py-3 font-semibold text-white hover:bg-[#3E6856]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* REQUEST REVIEW MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                  Request
                </p>

                <h3 className="mt-1 text-2xl font-bold text-[#26332F]">
                  Review Request
                </h3>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="rounded-lg p-2 text-[#71817A] hover:bg-[#F7F8F5]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 rounded-xl bg-[#F7F8F5] p-4">
              <p className="text-sm text-[#71817A]">
                Donation
              </p>

              <p className="font-semibold text-[#26332F]">
                {selectedRequest.item}
              </p>

              <p className="mt-3 text-sm text-[#71817A]">
                Requested by
              </p>

              <p className="font-semibold text-[#26332F]">
                {selectedRequest.receiver}
              </p>

              <p className="mt-3 text-sm text-[#71817A]">
                Date
              </p>

              <p className="font-semibold text-[#26332F]">
                {selectedRequest.date}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  handleRequestAction(
                    selectedRequest.id,
                    "Rejected"
                  )
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 py-3 font-semibold text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>

              <button
                onClick={() =>
                  handleRequestAction(
                    selectedRequest.id,
                    "Approved"
                  )
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4F7C68] py-3 font-semibold text-white hover:bg-[#3E6856]"
              >
                <Check className="h-4 w-4" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= DONATION GRID ================= */

function DonationGrid({
  donations,
  onView,
}: {
  donations: Donation[];
  onView: (donation: Donation) => void;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {donations.map((donation) => (
        <div
          key={donation.id}
          className="overflow-hidden rounded-2xl border border-[#DDE6DF] bg-white transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${donation.bg} text-[#4F7C68]`}
              >
                {donation.icon}
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  donation.status === "Completed"
                    ? "bg-[#E9F0EC] text-[#4F685A]"
                    : "bg-[#EDF5EF] text-[#4F7C68]"
                }`}
              >
                {donation.status}
              </span>
            </div>

            <h4 className="mt-5 font-heading text-xl font-bold text-[#26332F]">
              {donation.title}
            </h4>

            <p className="mt-2 text-sm leading-6 text-[#71817A]">
              {donation.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm text-[#71817A]">
                <Package className="h-4 w-4 text-[#4F7C68]" />
                {donation.quantity}
              </div>

              <div className="flex items-center gap-1.5 text-sm text-[#71817A]">
                <Users className="h-4 w-4 text-[#4F7C68]" />
                {donation.requests} requests
              </div>
            </div>

            <button
              onClick={() => onView(donation)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#9AB3A4] bg-white px-5 py-3 text-sm font-semibold text-[#3E6856] transition hover:bg-[#F1F6F2]"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= REQUEST LIST ================= */

function RequestList({
  requests,
  onReview,
}: {
  requests: DonationRequest[];
  onReview: (request: DonationRequest) => void;
}) {
  return (
    <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-[#DDE6DF] bg-white">
      {requests.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#71817A]">
          No donation requests yet.
        </div>
      ) : (
        requests.map((request, index) => (
          <div
            key={request.id}
            className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${
              index !== requests.length - 1
                ? "border-b border-[#E8EDE9]"
                : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDF5EF] text-[#4F7C68]">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold text-[#26332F]">
                  {request.item}
                </p>

                <p className="mt-1 text-xs text-[#8A9890]">
                  Requested by {request.receiver} • {request.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  request.status === "Approved"
                    ? "bg-[#E5F3E8] text-[#397151]"
                    : request.status === "Completed"
                    ? "bg-[#E9F0EC] text-[#4F685A]"
                    : request.status === "Rejected"
                    ? "bg-red-50 text-red-600"
                    : "bg-[#FFF1E8] text-[#B56C43]"
                }`}
              >
                {request.status}
              </span>

              {request.status === "Pending" && (
                <button
                  onClick={() => onReview(request)}
                  className="rounded-lg bg-[#4F7C68] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#3E6856]"
                >
                  Review
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ================= PROFILE FIELD ================= */

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#F7F8F5] p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-[#8A9890]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#26332F]">
        {value}
      </p>
    </div>
  );
}