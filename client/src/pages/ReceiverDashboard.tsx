import React, { useState } from "react";
import {
  Bell,
  ChevronDown,
  HeartHandshake,
  Home,
  MapPin,
  Package,
  Search,
  Settings,
  User,
  Utensils,
  Shirt,
  Clock,
  CheckCircle2,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function ReceiverDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const [search, setSearch] = useState("");

  const donations = [
    {
      id: 1,
      type: "Food",
      title: "Fresh Grocery Items",
      description:
        "Rice, flour, pulses and other grocery items available for a family.",
      location: "1.2 km away",
      donor: "Community Donor",
      icon: <Utensils className="h-6 w-6" />,
      bg: "bg-[#FFF2E9]",
    },
    {
      id: 2,
      type: "Clothes",
      title: "Clean Clothes",
      description:
        "Gently used clothes in good condition suitable for adults.",
      location: "2.4 km away",
      donor: "Local Donor",
      icon: <Shirt className="h-6 w-6" />,
      bg: "bg-[#EDF5EF]",
    },
    {
      id: 3,
      type: "Food",
      title: "Packed Food",
      description:
        "Freshly prepared food portions available for nearby families.",
      location: "3.1 km away",
      donor: "Community Kitchen",
      icon: <Utensils className="h-6 w-6" />,
      bg: "bg-[#FFF2E9]",
    },
  ];

  const requests = [
    {
      item: "Grocery Items",
      donor: "Community Donor",
      status: "Pending",
      date: "Today",
    },
    {
      item: "Winter Clothes",
      donor: "Local Donor",
      status: "Approved",
      date: "Yesterday",
    },
    {
      item: "Packed Food",
      donor: "Community Kitchen",
      status: "Completed",
      date: "24 Sep 2026",
    },
  ];

  const filteredDonations = donations.filter((donation) =>
    `${donation.title} ${donation.type} ${donation.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#26332F]">

      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

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

            {[
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
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setSidebarOpen(false);
                }}
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
              onClick={() => setActiveTab("Profile")}
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
              onClick={() => setActiveTab("Settings")}
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
              U
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#26332F]">
                User
              </p>

              <p className="truncate text-xs text-[#8A9890]">
                Receiver
              </p>
            </div>

            <LogOut className="h-4 w-4 text-[#8A9890]" />

          </div>

        </div>

      </aside>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="lg:pl-64">

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#E1E7E2] bg-[#F7F8F5]/90 px-5 backdrop-blur-xl sm:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-[#D9E1DB] bg-white p-2.5 text-[#2F5547] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <p className="text-xs font-medium text-[#8A9890]">
                Receiver Dashboard
              </p>

              <h2 className="font-heading text-lg font-bold text-[#26332F] sm:text-xl">
                Welcome back 👋
              </h2>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <button className="relative rounded-xl border border-[#D9E1DB] bg-white p-2.5 text-[#607068] transition hover:text-[#2F5547]">
              <Bell className="h-5 w-5" />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#4F7C68]" />
            </button>

            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DDE9DF] text-sm font-bold text-[#2F5547]">
                U
              </div>

              <ChevronDown className="h-4 w-4 text-[#71817A]" />
            </div>

          </div>

        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">

          {/* Welcome */}
          <div className="mb-8">

            <p className="text-sm text-[#71817A]">
              Find useful donations available around your community.
            </p>

          </div>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDF5EF] text-[#4F7C68]">
                  <Package className="h-5 w-5" />
                </div>

                <span className="text-xs font-medium text-[#6E8C7A]">
                  Available
                </span>

              </div>

              <p className="font-heading text-3xl font-bold text-[#26332F]">
                24
              </p>

              <p className="mt-1 text-sm text-[#71817A]">
                Donations nearby
              </p>

            </div>

            <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF2E9] text-[#C8794D]">
                  <Clock className="h-5 w-5" />
                </div>

                <span className="text-xs font-medium text-[#C8794D]">
                  Active
                </span>

              </div>

              <p className="font-heading text-3xl font-bold text-[#26332F]">
                5
              </p>

              <p className="mt-1 text-sm text-[#71817A]">
                Pending requests
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
                12
              </p>

              <p className="mt-1 text-sm text-[#71817A]">
                Donations received
              </p>

            </div>

            <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2EEE6] text-[#8B7657]">
                  <MapPin className="h-5 w-5" />
                </div>

                <span className="text-xs font-medium text-[#71817A]">
                  Nearby
                </span>

              </div>

              <p className="font-heading text-3xl font-bold text-[#26332F]">
                3.5 km
              </p>

              <p className="mt-1 text-sm text-[#71817A]">
                Average distance
              </p>

            </div>

          </div>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="mt-8 rounded-2xl border border-[#DDE6DF] bg-white p-5">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <h3 className="font-heading text-xl font-bold text-[#26332F]">
                  Find Donations
                </h3>

                <p className="mt-1 text-sm text-[#71817A]">
                  Search for food, clothes and other available items.
                </p>
              </div>

              <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-[#D8E1DA] bg-[#FAFCFA] px-4">

                <Search className="h-5 w-5 text-[#8A9890]" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search donations..."
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#9AA8A0]"
                />

              </div>

            </div>

          </div>

          {/* =================================================
              DONATIONS
          ================================================= */}

          <div className="mt-8">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                  Nearby
                </p>

                <h3 className="mt-1 font-heading text-2xl font-bold text-[#26332F]">
                  Available Donations
                </h3>
              </div>

              <button className="hidden text-sm font-semibold text-[#4F7C68] sm:block">
                View all →
              </button>

            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {filteredDonations.map((donation) => (
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

                      <span className="rounded-full bg-[#EDF5EF] px-3 py-1 text-xs font-semibold text-[#4F7C68]">
                        {donation.type}
                      </span>

                    </div>

                    <h4 className="mt-5 font-heading text-xl font-bold text-[#26332F]">
                      {donation.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-[#71817A]">
                      {donation.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 text-sm text-[#71817A]">
                      <MapPin className="h-4 w-4 text-[#4F7C68]" />
                      {donation.location}
                    </div>

                    <p className="mt-2 text-xs text-[#9AA8A0]">
                      Posted by {donation.donor}
                    </p>

                    <button className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#4F7C68] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3E6856]">
                      Request Donation
                    </button>

                  </div>

                </div>
              ))}

            </div>

            {filteredDonations.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#CBD8CE] bg-white p-10 text-center">

                <Search className="mx-auto h-8 w-8 text-[#9AA8A0]" />

                <p className="mt-3 font-semibold text-[#26332F]">
                  No donations found
                </p>

                <p className="mt-1 text-sm text-[#71817A]">
                  Try searching for another item.
                </p>

              </div>
            )}

          </div>

          {/* =================================================
              MY REQUESTS
          ================================================= */}

          <div className="mt-10">

            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                Activity
              </p>

              <h3 className="mt-1 font-heading text-2xl font-bold text-[#26332F]">
                My Requests
              </h3>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#DDE6DF] bg-white">

              {requests.map((request, index) => (

                <div
                  key={request.item}
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
                        From {request.donor} • {request.date}
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

              ))}

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}