import React, { useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  HeartHandshake,
  Home,
  Search,
  Package,
  User,
  Settings,
  Menu,
  X,
  LogOut,
  MapPin,
  Clock,
  CheckCircle2,
  Eye,
  Send,
  Utensils,
  Shirt,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

type Tab =
  | "Overview"
  | "Find Donations"
  | "My Requests"
  | "Profile"
  | "Settings";

type DonationStatus = "Available" | "Requested";

type Donation = {
  id: number;
  type: "Food" | "Clothes";
  title: string;
  description: string;
  quantity: string;
  location: string;
  distance: string;
  status: DonationStatus;
  icon: React.ReactNode;
  bg: string;
};

type RequestStatus = "Pending" | "Approved" | "Completed";

type DonationRequest = {
  id: number;
  item: string;
  donor: string;
  status: RequestStatus;
  date: string;
};

export default function ReceiverDashboard() {
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [search, setSearch] = useState("");

  const [donations, setDonations] = useState<Donation[]>([
    {
      id: 1,
      type: "Food",
      title: "Grocery Essentials",
      description:
        "Rice, flour, sugar and other grocery items available for nearby families.",
      quantity: "5 items",
      location: "Kanpur",
      distance: "1.2 km",
      status: "Available",
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
      location: "Kakadeo",
      distance: "2.4 km",
      status: "Available",
      icon: <Shirt className="h-6 w-6" />,
      bg: "bg-[#EDF5EF]",
    },
    {
      id: 3,
      type: "Food",
      title: "Packed Meals",
      description:
        "Freshly prepared meals available for nearby community members.",
      quantity: "10 meals",
      location: "Swaroop Nagar",
      distance: "3.1 km",
      status: "Available",
      icon: <Utensils className="h-6 w-6" />,
      bg: "bg-[#FFF2E9]",
    },
    {
      id: 4,
      type: "Clothes",
      title: "Children's Clothes",
      description:
        "Gently-used children's clothing available for families in need.",
      quantity: "12 items",
      location: "Arya Nagar",
      distance: "4.2 km",
      status: "Available",
      icon: <Shirt className="h-6 w-6" />,
      bg: "bg-[#EDF5EF]",
    },
  ]);

  const [requests, setRequests] = useState<DonationRequest[]>([
    {
      id: 1,
      item: "Grocery Essentials",
      donor: "Community Donor",
      status: "Pending",
      date: "Today",
    },
    {
      id: 2,
      item: "Winter Clothes",
      donor: "Local Donor",
      status: "Approved",
      date: "Yesterday",
    },
  ]);

  const [selectedDonation, setSelectedDonation] =
    useState<Donation | null>(null);

  const [showNotifications, setShowNotifications] = useState(false);

  const userName = user?.name || "User";

  const navigateTab = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleRequestDonation = (donation: Donation) => {
    setDonations((prev) =>
      prev.map((item) =>
        item.id === donation.id
          ? { ...item, status: "Requested" }
          : item
      )
    );

    const alreadyRequested = requests.some(
      (request) => request.item === donation.title
    );

    if (!alreadyRequested) {
      setRequests((prev) => [
        {
          id: Date.now(),
          item: donation.title,
          donor: "Community Donor",
          status: "Pending",
          date: "Just now",
        },
        ...prev,
      ]);
    }

    setSelectedDonation(null);
    setActiveTab("My Requests");
  };

  const filteredDonations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return donations;

    return donations.filter(
      (donation) =>
        donation.title.toLowerCase().includes(query) ||
        donation.type.toLowerCase().includes(query) ||
        donation.location.toLowerCase().includes(query)
    );
  }, [donations, search]);

  const pendingRequests = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const approvedRequests = requests.filter(
    (request) => request.status === "Approved"
  ).length;

  const navigation: {
    name: Tab;
    icon: React.ReactNode;
  }[] = [
    {
      name: "Overview",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Find Donations",
      icon: <Search className="h-5 w-5" />,
    },
    {
      name: "My Requests",
      icon: <Package className="h-5 w-5" />,
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
                Receiver
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

      {/* MAIN */}
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
                Receiver Dashboard
              </p>

              <h2 className="font-heading text-lg font-bold text-[#26332F] sm:text-xl">
                Welcome back, {userName.split(" ")[0]} 👋
              </h2>
            </div>
          </div>

          <div className="relative flex items-center gap-3">
            <button
              onClick={() =>
                setShowNotifications((prev) => !prev)
              }
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
                  You have {pendingRequests} pending request
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

        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">

          {/* ================= OVERVIEW ================= */}
          {activeTab === "Overview" && (
            <>
              <div className="mb-8">
                <p className="text-sm text-[#71817A]">
                  Find useful donations from people in your nearby community.
                </p>
              </div>

              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDF5EF] text-[#4F7C68]">
                    <Search className="h-5 w-5" />
                  </div>

                  <p className="font-heading text-3xl font-bold text-[#26332F]">
                    {donations.filter(
                      (item) => item.status === "Available"
                    ).length}
                  </p>

                  <p className="mt-1 text-sm text-[#71817A]">
                    Available donations
                  </p>
                </div>

                <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF2E9] text-[#C8794D]">
                    <Package className="h-5 w-5" />
                  </div>

                  <p className="font-heading text-3xl font-bold text-[#26332F]">
                    {requests.length}
                  </p>

                  <p className="mt-1 text-sm text-[#71817A]">
                    My requests
                  </p>
                </div>

                <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2EEE6] text-[#8B7657]">
                    <Clock className="h-5 w-5" />
                  </div>

                  <p className="font-heading text-3xl font-bold text-[#26332F]">
                    {pendingRequests}
                  </p>

                  <p className="mt-1 text-sm text-[#71817A]">
                    Pending requests
                  </p>
                </div>

                <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDF5EF] text-[#4F7C68]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <p className="font-heading text-3xl font-bold text-[#26332F]">
                    {approvedRequests}
                  </p>

                  <p className="mt-1 text-sm text-[#71817A]">
                    Approved requests
                  </p>
                </div>
              </div>

              {/* Search CTA */}
              <div className="mt-8 overflow-hidden rounded-2xl bg-[#2F5547] p-6 text-white sm:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                      <HeartHandshake className="h-5 w-5" />
                    </div>

                    <h3 className="font-heading text-2xl font-bold">
                      Looking for something?
                    </h3>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-[#C8D9CE]">
                      Explore food, clothes and other useful items available
                      from nearby donors.
                    </p>
                  </div>

                  <button
                    onClick={() => navigateTab("Find Donations")}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#2F5547] transition hover:bg-[#F1F6F2]"
                  >
                    <Search className="h-4 w-4" />
                    Find Donations
                  </button>
                </div>
              </div>

              {/* Nearby Donations */}
              <section className="mt-10">
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                      Nearby
                    </p>

                    <h3 className="mt-1 font-heading text-2xl font-bold text-[#26332F]">
                      Available Donations
                    </h3>
                  </div>

                  <button
                    onClick={() => navigateTab("Find Donations")}
                    className="hidden text-sm font-semibold text-[#4F7C68] sm:block"
                  >
                    View all →
                  </button>
                </div>

                <DonationGrid
                  donations={donations.slice(0, 3)}
                  onView={setSelectedDonation}
                  onRequest={handleRequestDonation}
                />
              </section>
            </>
          )}

          {/* ================= FIND DONATIONS ================= */}
          {activeTab === "Find Donations" && (
            <section>
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                  Discover
                </p>

                <h2 className="mt-1 font-heading text-3xl font-bold text-[#26332F]">
                  Find Donations
                </h2>

                <p className="mt-2 text-sm text-[#71817A]">
                  Search for donations available near you.
                </p>
              </div>

              {/* Search */}
              <div className="relative mb-8 max-w-2xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8A9890]" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search food, clothes, location..."
                  className="w-full rounded-xl border border-[#D9E1DB] bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-[#9AA8A1] focus:border-[#4F7C68] focus:ring-2 focus:ring-[#E5F0E8]"
                />
              </div>

              {filteredDonations.length === 0 ? (
                <div className="rounded-2xl border border-[#DDE6DF] bg-white p-10 text-center">
                  <Search className="mx-auto h-10 w-10 text-[#9AA8A0]" />

                  <h3 className="mt-4 font-semibold text-[#26332F]">
                    No donations found
                  </h3>

                  <p className="mt-2 text-sm text-[#71817A]">
                    Try searching with another keyword.
                  </p>
                </div>
              ) : (
                <DonationGrid
                  donations={filteredDonations}
                  onView={setSelectedDonation}
                  onRequest={handleRequestDonation}
                />
              )}
            </section>
          )}

          {/* ================= MY REQUESTS ================= */}
          {activeTab === "My Requests" && (
            <section>
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                  Your activity
                </p>

                <h2 className="mt-1 font-heading text-3xl font-bold text-[#26332F]">
                  My Requests
                </h2>
              </div>

              <div className="max-h-[460px] overflow-y-auto rounded-2xl border border-[#DDE6DF] bg-white">
                {requests.length === 0 ? (
                  <div className="p-10 text-center text-sm text-[#71817A]">
                    You have not requested any donations yet.
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
                          <Package className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-semibold text-[#26332F]">
                            {request.item}
                          </p>

                          <p className="mt-1 text-xs text-[#8A9890]">
                            Donor: {request.donor} • {request.date}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                          request.status === "Approved"
                            ? "bg-[#E5F3E8] text-[#397151]"
                            : request.status === "Completed"
                            ? "bg-[#E9F0EC] text-[#4F685A]"
                            : "bg-[#FFF1E8] text-[#B56C43]"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
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
                      Receiver
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
                    Distance
                  </p>

                  <p className="mt-1 font-semibold text-[#C8794D]">
                    {selectedDonation.distance}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-[#F7F8F5] p-4 text-sm text-[#71817A]">
                <MapPin className="h-4 w-4 text-[#4F7C68]" />
                {selectedDonation.location}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedDonation(null)}
                className="flex-1 rounded-xl border border-[#D9E1DB] py-3 font-semibold text-[#4F7C68] hover:bg-[#F1F6F2]"
              >
                Close
              </button>

              {selectedDonation.status === "Available" && (
                <button
                  onClick={() =>
                    handleRequestDonation(selectedDonation)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4F7C68] py-3 font-semibold text-white hover:bg-[#3E6856]"
                >
                  <Send className="h-4 w-4" />
                  Request
                </button>
              )}
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
  onRequest,
}: {
  donations: Donation[];
  onView: (donation: Donation) => void;
  onRequest: (donation: Donation) => void;
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
                  donation.status === "Requested"
                    ? "bg-[#FFF1E8] text-[#B56C43]"
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

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-1.5 text-sm text-[#71817A]">
                <Package className="h-4 w-4 text-[#4F7C68]" />
                {donation.quantity}
              </div>

              <div className="flex items-center gap-1.5 text-sm text-[#71817A]">
                <MapPin className="h-4 w-4 text-[#4F7C68]" />
                {donation.location} • {donation.distance}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => onView(donation)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#9AB3A4] px-3 py-3 text-sm font-semibold text-[#3E6856] transition hover:bg-[#F1F6F2]"
              >
                <Eye className="h-4 w-4" />
                View
              </button>

              <button
                onClick={() => onRequest(donation)}
                disabled={donation.status === "Requested"}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#4F7C68] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[#3E6856] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {donation.status === "Requested"
                  ? "Requested"
                  : "Request"}
              </button>
            </div>
          </div>
        </div>
      ))}
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