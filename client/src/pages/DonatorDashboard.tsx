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
} from "lucide-react";

export default function DonatorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const donations = [
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
  ];

  const requests = [
    {
      item: "Grocery Essentials",
      receiver: "Nearby Family",
      status: "Pending",
      date: "Today",
    },
    {
      item: "Winter Clothes",
      receiver: "Local Resident",
      status: "Approved",
      date: "Yesterday",
    },
    {
      item: "Packed Meals",
      receiver: "Community Member",
      status: "Completed",
      date: "24 Sep 2026",
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

            {[
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
                Donator
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
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>

              <p className="text-xs font-medium text-[#8A9890]">
                Donator Dashboard
              </p>

              <h2 className="font-heading text-lg font-bold text-[#26332F] sm:text-xl">
                Welcome back 👋
              </h2>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              className="relative rounded-xl border border-[#D9E1DB] bg-white p-2.5 text-[#607068] transition hover:text-[#2F5547]"
              aria-label="Notifications"
            >
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

          {/* Welcome + CTA */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm text-[#71817A]">
                Make a difference by sharing what you can with your community.
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

          {/* =====================================================
              IMPACT STATISTICS
          ===================================================== */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Total Donations */}
            <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDF5EF] text-[#4F7C68]">
                  <Package className="h-5 w-5" />
                </div>

                <ArrowUpRight className="h-4 w-4 text-[#6E8C7A]" />

              </div>

              <p className="font-heading text-3xl font-bold text-[#26332F]">
                18
              </p>

              <p className="mt-1 text-sm text-[#71817A]">
                Total donations
              </p>

            </div>

            {/* People Helped */}
            <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF2E9] text-[#C8794D]">
                  <Users className="h-5 w-5" />
                </div>

                <ArrowUpRight className="h-4 w-4 text-[#6E8C7A]" />

              </div>

              <p className="font-heading text-3xl font-bold text-[#26332F]">
                42
              </p>

              <p className="mt-1 text-sm text-[#71817A]">
                People helped
              </p>

            </div>

            {/* Completed */}
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
                15
              </p>

              <p className="mt-1 text-sm text-[#71817A]">
                Successful donations
              </p>

            </div>

            {/* Pending Requests */}
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
                6
              </p>

              <p className="mt-1 text-sm text-[#71817A]">
                Pending requests
              </p>

            </div>

          </div>

          {/* =====================================================
              QUICK POST DONATION
          ===================================================== */}

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
                  Share food, clothes or useful items with someone nearby who
                  needs them.
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

          {/* =====================================================
              MY DONATIONS
          ===================================================== */}

          <div className="mt-10">

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

                    <button className="mt-5 flex w-full items-center justify-center rounded-xl border border-[#9AB3A4] bg-white px-5 py-3 text-sm font-semibold text-[#3E6856] transition hover:bg-[#F1F6F2]">
                      View Details
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* =====================================================
              DONATION REQUESTS
          ===================================================== */}

          <div className="mt-10">

            <div className="mb-5">

              <p className="text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                Incoming
              </p>

              <h3 className="mt-1 font-heading text-2xl font-bold text-[#26332F]">
                Donation Requests
              </h3>

            </div>

            <div className="overflow-hidden rounded-2xl border border-[#DDE6DF] bg-white">

              {requests.map((request, index) => (

                <div
                  key={`${request.item}-${request.receiver}`}
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
                          : "bg-[#FFF1E8] text-[#B56C43]"
                      }`}
                    >
                      {request.status}
                    </span>

                    {request.status === "Pending" && (
                      <button className="rounded-lg bg-[#4F7C68] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#3E6856]">
                        Review
                      </button>
                    )}

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* =====================================================
              IMPACT MESSAGE
          ===================================================== */}

          <div className="mb-4 mt-10 rounded-2xl border border-[#DDE6DF] bg-[#EDF5EF] p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#4F7C68]">
                <HeartHandshake className="h-5 w-5" />
              </div>

              <div>

                <h4 className="font-heading text-lg font-bold text-[#2F5547]">
                  Your kindness creates an impact.
                </h4>

                <p className="mt-1 text-sm leading-6 text-[#607068]">
                  Every item you share can make someone's day a little easier.
                  Thank you for being part of the SAHARA community.
                </p>

              </div>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}