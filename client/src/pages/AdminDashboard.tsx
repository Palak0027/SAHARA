import { useMemo, useState } from "react";
import {
  Bell,
  BarChart3,
  CheckCircle,
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
  X,
  XCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import type { LucideIcon } from "lucide-react";

type Tab =
  | "Overview"
  | "Users"
  | "Donations"
  | "Requests"
  | "Volunteers"
  | "Reports"
  | "Account";

type UserStatus = "Active" | "Blocked";

type UserItem = {
  id: number;
  name: string;
  phone: string;
  role: "Donor" | "Receiver" | "Volunteer" | "Admin";
  status: UserStatus;
};

type DonationStatus = "Available" | "Requested" | "Completed";

type Donation = {
  id: number;
  title: string;
  category: "Food" | "Clothes";
  donor: string;
  location: string;
  status: DonationStatus;
};

type RequestStatus = "Pending" | "Approved" | "Rejected";

type ManageRow = {
  id: number;
  name: string;
  role: string;
  status: string;
};

const nav: { label: Tab; icon: LucideIcon }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Users", icon: Users },
  { label: "Donations", icon: Package },
  { label: "Requests", icon: ClipboardList },
  { label: "Volunteers", icon: UserCheck },
  { label: "Reports", icon: BarChart3 },
  { label: "Account", icon: UserCog },
];

const initialUsers: UserItem[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    phone: "9876543210",
    role: "Donor",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Verma",
    phone: "9876501234",
    role: "Receiver",
    status: "Active",
  },
  {
    id: 3,
    name: "Amit Singh",
    phone: "9876512345",
    role: "Donor",
    status: "Blocked",
  },
  {
    id: 4,
    name: "Neha Gupta",
    phone: "9876523456",
    role: "Receiver",
    status: "Active",
  },
  {
    id: 5,
    name: "Rohan Mishra",
    phone: "9876534567",
    role: "Volunteer",
    status: "Active",
  },
];

const initialDonations: Donation[] = [
  {
    id: 1,
    title: "Grocery Essentials",
    category: "Food",
    donor: "Rahul Sharma",
    location: "Kanpur",
    status: "Available",
  },
  {
    id: 2,
    title: "Winter Clothes",
    category: "Clothes",
    donor: "Neha Kapoor",
    location: "Kanpur",
    status: "Requested",
  },
  {
    id: 3,
    title: "Packed Meals",
    category: "Food",
    donor: "Aman Verma",
    location: "Kanpur",
    status: "Completed",
  },
  {
    id: 4,
    title: "Children's Clothes",
    category: "Clothes",
    donor: "Priya Singh",
    location: "Kanpur",
    status: "Available",
  },
];

const initialRequests: ManageRow[] = [
  {
    id: 1,
    name: "Priya Verma",
    role: "Receiver",
    status: "Pending",
  },
  {
    id: 2,
    name: "Neha Gupta",
    role: "Receiver",
    status: "Approved",
  },
  {
    id: 3,
    name: "Aman Kumar",
    role: "Receiver",
    status: "Pending",
  },
  {
    id: 4,
    name: "Riya Sharma",
    role: "Receiver",
    status: "Rejected",
  },
];

const initialVolunteers: ManageRow[] = [
  {
    id: 1,
    name: "Rohan Mishra",
    role: "Pickup Volunteer",
    status: "Active",
  },
  {
    id: 2,
    name: "Ankit Yadav",
    role: "Distribution Volunteer",
    status: "Active",
  },
  {
    id: 3,
    name: "Sneha Gupta",
    role: "Community Volunteer",
    status: "Inactive",
  },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [donations, setDonations] =
    useState<Donation[]>(initialDonations);
  const [requests, setRequests] =
    useState<ManageRow[]>(initialRequests);
  const [volunteers, setVolunteers] =
    useState<ManageRow[]>(initialVolunteers);

  const [userSearch, setUserSearch] = useState("");
  const [donationSearch, setDonationSearch] = useState("");

  const activeUsers = useMemo(
    () => users.filter((item) => item.status === "Active").length,
    [users]
  );

  const blockedUsers = useMemo(
    () => users.filter((item) => item.status === "Blocked").length,
    [users]
  );

  const availableDonations = useMemo(
    () =>
      donations.filter((item) => item.status === "Available").length,
    [donations]
  );

  const pendingRequests = useMemo(
    () =>
      requests.filter((item) => item.status === "Pending").length,
    [requests]
  );

  const activeVolunteers = useMemo(
    () =>
      volunteers.filter((item) => item.status === "Active").length,
    [volunteers]
  );

  const filteredUsers = users.filter((item) => {
    const value = userSearch.toLowerCase();

    return (
      item.name.toLowerCase().includes(value) ||
      item.phone.includes(value) ||
      item.role.toLowerCase().includes(value)
    );
  });

  const filteredDonations = donations.filter((item) => {
    const value = donationSearch.toLowerCase();

    return (
      item.title.toLowerCase().includes(value) ||
      item.category.toLowerCase().includes(value) ||
      item.donor.toLowerCase().includes(value)
    );
  });

  const navigateTab = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    setShowNotifications(false);
  };

  const toggleUserStatus = (id: number) => {
    setUsers((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "Active"
                  ? "Blocked"
                  : "Active",
            }
          : item
      )
    );
  };

  const approveRequest = (id: number) => {
    setRequests((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: "Approved" }
          : item
      )
    );
  };

  const rejectRequest = (id: number) => {
    setRequests((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: "Rejected" }
          : item
      )
    );
  };

  const toggleVolunteerStatus = (id: number) => {
    setVolunteers((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : item
      )
    );
  };

  const updateDonationStatus = (
    id: number,
    status: DonationStatus
  ) => {
    setDonations((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#26332F]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-[#DDE6DF] bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-18 items-center justify-between border-b border-[#E6ECE8] px-3">
          <div>
            <h1 className="text-2xl font-bold text-[#2F5547]">
              SAHARA
            </h1>
            <p className="mt-0.3 text-xs text-[#8A9891]">
              Admin Panel
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-[#71817A] hover:bg-[#F3F6F3] lg:hidden"
          >
            <X className="h-2 w-3" />
          </button>
        </div>

        <div className="shrink-0 border-b border-[#E6ECE8] px-3 py-3">
          <div className="flex items-center gap-3 rounded-xl bg-[#F3F7F4] p-2.5">
            <div className="flex h-9 w-11 items-center justify-center rounded-full bg-[#DDEBE2] text-[#3E6856]">
              <ShieldCheck className="h-3 w-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#26332F]">
                {user?.name || "SAHARA Admin"}
              </p>
              <p className="text-xs text-[#71817A]">
                Administrator
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.label;

            return (
              <button
                key={item.label}
                onClick={() => navigateTab(item.label)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  active
                    ? "bg-[#E7F0E9] text-[#3E6856]"
                    : "text-[#65756D] hover:bg-[#F4F7F5] hover:text-[#3E6856]"
                }`}
              >
                <Icon className="h-3 w-5" />
                <span>{item.label}</span>

                {item.label === "Requests" &&
                  pendingRequests > 0 && (
                    <span className="ml-auto flex h-3 min-w-5 items-center justify-center rounded-full bg-[#4F7C68] px-1.5 text-[10px] font-bold text-white">
                      {pendingRequests}
                    </span>
                  )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[#E6ECE8] p-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#A05B5B] transition hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 lg:pl-64">
        {/* Header */}
        <header className="relative z-30 flex min-h-[76px] w-full items-center justify-between gap-3 border-b border-[#DDE6DF] bg-white px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-[#4F655C] hover:bg-[#F3F6F3] lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div>
              <p className="m-0 text-xs font-medium leading-4 text-[#8A9891]">
                Admin Dashboard
              </p>
              <h2 className="m-0 text-lg font-bold leading-6 text-[#26332F]">
                {activeTab}
              </h2>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() =>
                setShowNotifications((current) => !current)
              }
              className="relative rounded-xl p-2.5 text-[#65756D] hover:bg-[#F3F6F3]"
            >
              <Bell className="h-5 w-5" />

              {pendingRequests > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#C66B5B]" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 rounded-2xl border border-[#DDE6DF] bg-white p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-[#26332F]">
                    Notifications
                  </h3>

                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#8A9891]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl bg-[#F3F7F4] p-3">
                    <p className="text-sm font-medium text-[#34453E]">
                      {pendingRequests} request
                      {pendingRequests !== 1 ? "s" : ""} waiting
                      for review.
                    </p>
                    <button
                      onClick={() => navigateTab("Requests")}
                      className="mt-2 text-xs font-semibold text-[#4F7C68]"
                    >
                      Review requests →
                    </button>
                  </div>

                  <div className="rounded-xl bg-[#E7F4E8] p-2">
                    <p className="text-sm text-[#176C62]">
                      {availableDonations} donations are currently
                      available.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="px-3 py-3 sm:px-4 sm:py-3 lg:px-5 lg:py-4">
          {/* OVERVIEW */}
          {activeTab === "Overview" && (
            <div className="space-y-2.5">
              <div>
                <p className="text-sm font-medium text-[#4F7C68]">
                  Welcome back 👋
                </p>
                <h1 className="mt-1 text-xl font-bold leading-tight text-[#26332F] sm:text-2xl">
                  SAHARA Administration
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-[#71817A]">
                  Monitor users, donations, requests and volunteer
                  activity from one place.
                </p>
              </div>

              <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStat
                  icon={Users}
                  value={activeUsers}
                  label="Active Users"
                />

                <AdminStat
                  icon={Package}
                  value={availableDonations}
                  label="Available Donations"
                />

                <AdminStat
                  icon={ClipboardList}
                  value={pendingRequests}
                  label="Pending Requests"
                />

                <AdminStat
                  icon={UserCheck}
                  value={activeVolunteers}
                  label="Active Volunteers"
                />
              </div>

              <div className="grid items-start gap-3 xl:grid-cols-2">
                <div className="rounded-xl border border-[#DDE6DF] bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#26332F]">
                        Recent Requests
                      </h3>
                      <p className="mt-1 text-xs text-[#8A9891]">
                        Requests requiring attention
                      </p>
                    </div>

                    <button
                      onClick={() => navigateTab("Requests")}
                      className="text-sm font-semibold text-[#4F7C68]"
                    >
                      View all
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {requests.slice(0, 4).map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between rounded-lg border border-[#E6ECE8] px-3 py-2.5"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#34453E]">
                            {request.name}
                          </p>
                          <p className="mt-1 text-xs text-[#8A9891]">
                            {request.role}
                          </p>
                        </div>

                        <StatusBadge status={request.status} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[#DDE6DF] bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#26332F]">
                        Platform Summary
                      </h3>
                      <p className="mt-1 text-xs text-[#8A9891]">
                        Current platform activity
                      </p>
                    </div>

                    <HeartHandshake className="h-5 w-5 text-[#4F7C68]" />
                  </div>

                  <div className="space-y-2.5">
                    <SummaryRow
                      label="Total users"
                      value={users.length}
                    />
                    <SummaryRow
                      label="Blocked users"
                      value={blockedUsers}
                    />
                    <SummaryRow
                      label="Total donations"
                      value={donations.length}
                    />
                    <SummaryRow
                      label="Total requests"
                      value={requests.length}
                    />
                    <SummaryRow
                      label="Volunteers"
                      value={volunteers.length}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USERS */}
          {activeTab === "Users" && (
            <section className="space-y-2.5">
              <SectionHeading
                title="Manage Users"
                description="View and manage registered SAHARA users."
              />

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9891]" />
                <input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name, phone or role..."
                  className="w-full rounded-lg border border-[#D9E1DB] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4F7C68] focus:ring-2 focus:ring-[#E5F0E8]"
                />
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#DDE6DF] bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead className="bg-[#F5F8F5]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#71817A]">
                          User
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#71817A]">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#71817A]">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#71817A]">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#71817A]">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#E6ECE8]">
                      {filteredUsers.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <p className="text-sm font-semibold text-[#34453E]">
                              {item.name}
                            </p>
                          </td>

                          <td className="px-4 py-3 text-sm text-[#71817A]">
                            {item.phone}
                          </td>

                          <td className="px-4 py-3">
                            <span className="rounded-full bg-[#EEF4F0] px-3 py-1 text-xs font-medium text-[#4F7C68]">
                              {item.role}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <StatusBadge status={item.status} />
                          </td>

                          <td className="px-4 py-3 text-right">
                            {item.role !== "Admin" && (
                              <button
                                onClick={() =>
                                  toggleUserStatus(item.id)
                                }
                                className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                                  item.status === "Active"
                                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                                    : "bg-green-50 text-green-700 hover:bg-green-100"
                                }`}
                              >
                                {item.status === "Active"
                                  ? "Block"
                                  : "Unblock"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* DONATIONS */}
          {activeTab === "Donations" && (
            <section className="space-y-2.5">
              <SectionHeading
                title="Manage Donations"
                description="Monitor donations posted by community members."
              />

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9891]" />
                <input
                  value={donationSearch}
                  onChange={(e) =>
                    setDonationSearch(e.target.value)
                  }
                  placeholder="Search donations..."
                  className="w-full rounded-lg border border-[#D9E1DB] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4F7C68] focus:ring-2 focus:ring-[#E5F0E8]"
                />
              </div>

              <div className="grid items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="rounded-xl border border-[#DDE6DF] bg-white p-3.5"
                  >
                    <div className="mb-2.5 flex items-start justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F1EA] text-[#4F7C68]">
                        <Package className="h-4 w-4" />
                      </div>

                      <StatusBadge status={donation.status} />
                    </div>

                    <h3 className="text-base font-bold leading-5 text-[#26332F]">
                      {donation.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#71817A]">
                      {donation.category} · {donation.location}
                    </p>

                    <p className="mt-2 text-xs text-[#8A9891]">
                      Donated by {donation.donor}
                    </p>

                    <select
                      value={donation.status}
                      onChange={(e) =>
                        updateDonationStatus(
                          donation.id,
                          e.target.value as DonationStatus
                        )
                      }
                      className="mt-3 w-full rounded-lg border border-[#D9E1DB] bg-white px-3 py-1.5 text-sm outline-none focus:border-[#4F7C68]"
                    >
                      <option value="Available">Available</option>
                      <option value="Requested">Requested</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* REQUESTS */}
          {activeTab === "Requests" && (
            <section className="space-y-2.5">
              <SectionHeading
                title="Manage Requests"
                description="Review and manage donation requests."
              />

              <div className="max-h-[520px] space-y-2.5 overflow-y-auto pr-1">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-3 rounded-xl border border-[#DDE6DF] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[#34453E]">
                        {request.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#8A9891]">
                        {request.role}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <StatusBadge status={request.status} />

                      {request.status === "Pending" && (
                        <>
                          <button
                            onClick={() =>
                              approveRequest(request.id)
                            }
                            className="flex items-center gap-1.5 rounded-lg bg-[#E7F3EA] px-3 py-2 text-xs font-semibold text-[#3E6856] hover:bg-[#DCECDF]"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              rejectRequest(request.id)
                            }
                            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* VOLUNTEERS */}
          {activeTab === "Volunteers" && (
            <section className="space-y-2.5">
              <SectionHeading
                title="Manage Volunteers"
                description="Monitor volunteer availability and roles."
              />

              <div className="grid items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
                {volunteers.map((volunteer) => (
                  <div
                    key={volunteer.id}
                    className="rounded-xl border border-[#DDE6DF] bg-white p-3.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E7F0E9] text-[#4F7C68]">
                        <UserCheck className="h-5 w-5" />
                      </div>

                      <StatusBadge status={volunteer.status} />
                    </div>

                    <h3 className="mt-2.5 font-bold text-[#26332F]">
                      {volunteer.name}
                    </h3>

                    <p className="mt-1 text-sm text-[#71817A]">
                      {volunteer.role}
                    </p>

                    <button
                      onClick={() =>
                        toggleVolunteerStatus(volunteer.id)
                      }
                      className={`mt-3 w-full rounded-xl py-2.5 text-sm font-semibold ${
                        volunteer.status === "Active"
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-[#E7F3EA] text-[#3E6856] hover:bg-[#DCECDF]"
                      }`}
                    >
                      {volunteer.status === "Active"
                        ? "Mark Inactive"
                        : "Mark Active"}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* REPORTS */}
          {activeTab === "Reports" && (
            <section className="space-y-2.5">
              <SectionHeading
                title="Reports & Impact"
                description="A frontend overview of SAHARA's current activity."
              />

              <div className="grid items-start gap-3 md:grid-cols-2 xl:grid-cols-4">
                <ReportCard
                  icon={Users}
                  label="Registered Users"
                  value={users.length}
                />

                <ReportCard
                  icon={Package}
                  label="Total Donations"
                  value={donations.length}
                />

                <ReportCard
                  icon={ClipboardList}
                  label="Total Requests"
                  value={requests.length}
                />

                <ReportCard
                  icon={HeartHandshake}
                  label="Active Volunteers"
                  value={activeVolunteers}
                />
              </div>

              <div className="rounded-xl border border-[#DDE6DF] bg-white p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F0E9] text-[#4F7C68]">
                    <BarChart3 className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-[#26332F]">
                      Platform Health
                    </h3>
                    <p className="text-xs text-[#8A9891]">
                      Current frontend demo metrics
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <ProgressRow
                    label="Active users"
                    value={activeUsers}
                    total={Math.max(users.length, 1)}
                  />

                  <ProgressRow
                    label="Available donations"
                    value={availableDonations}
                    total={Math.max(donations.length, 1)}
                  />

                  <ProgressRow
                    label="Active volunteers"
                    value={activeVolunteers}
                    total={Math.max(volunteers.length, 1)}
                  />
                </div>
              </div>
            </section>
          )}

          {/* ACCOUNT: Profile and preferences combined */}
          {activeTab === "Account" && (
            <section className="max-w-2xl space-y-2">
              <SectionHeading
                title="Account"
                description="View administrator details and manage dashboard preferences."
              />

              <div className="grid items-start gap-4 xl:grid-cols-0">
                <div className="rounded-xl border border-[#DDE6DF] bg-white p-4">
                  <div className="mb-4 flex items-center gap-1">
                    <div className="flex h-15 w-11 items-center justify-center rounded-full bg-[#DDEBE2] text-[#3E6856]">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-[#26332F]">
                        {user?.name || "SAHARA Admin"}
                      </h3>
                      <p className="text-sm text-[#71817A]">Administrator</p>
                    </div>
                  </div>

                  <div className="grid gap-1 sm:grid-cols-2">
                    <ProfileField label="Name" value={user?.name || "SAHARA Admin"} />
                    <ProfileField label="Phone" value={user?.phone || "Not available"} />
                    <ProfileField label="Email" value={user?.email || "Not available"} />
                    <ProfileField label="Role" value="Administrator" />
                  </div>
                </div>

                <div className="space-y-1.0">
                  <h2 className="text-base font-bold text-[#26332F]">Preferences</h2>
                  <SettingRow
                    title="Email Notifications"
                    description="Receive important platform activity updates."
                  />
                  <SettingRow
                    title="Request Alerts"
                    description="Get notified when requests need review."
                  />
                  <SettingRow
                    title="Volunteer Updates"
                    description="Receive volunteer availability updates."
                  />
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <div>
                      <h3 className="text-sm font-semibold text-red-700">Sign out</h3>
                      <p className="mt-0.5 text-xs text-red-600/80">
                        End your administrator session.
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="shrink-0 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   LOCAL UI HELPERS
========================================================= */

function AdminStat({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
}) {
  return (
    <div className="min-h-0 rounded-xl border border-[#DDE6DF] bg-white p-3.5">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E7F0E9] text-[#4F7C68]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-2.5 text-xl font-bold leading-6 text-[#26332F]">
        {value}
      </p>

      <p className="mt-1 text-sm leading-5 text-[#71817A]">{label}</p>
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h1 className="text-xl font-bold leading-tight text-[#26332F] sm:text-2xl">
        {title}
      </h1>

      <p className="mt-1 text-sm text-[#71817A]">
        {description}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const positive =
    status === "Active" ||
    status === "Approved" ||
    status === "Available" ||
    status === "Completed";

  const negative =
    status === "Blocked" ||
    status === "Rejected" ||
    status === "Inactive";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        positive
          ? "bg-[#E7F3EA] text-[#3E6856]"
          : negative
          ? "bg-red-50 text-red-600"
          : "bg-[#E7F4E8] text-[#176C62]"
      }`}
    >
      {status}
    </span>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#EDF1EE] pb-2 last:border-0 last:pb-0">
      <span className="text-sm text-[#71817A]">{label}</span>
      <span className="text-sm font-bold text-[#34453E]">
        {value}
      </span>
    </div>
  );
}

function ReportCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="min-h-0 rounded-xl border border-[#DDE6DF] bg-white p-3.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F0E9] text-[#4F7C68]">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-2 text-xl font-bold leading-6 text-[#26332F]">
        {value}
      </p>

      <p className="mt-1 text-sm leading-5 text-[#71817A]">{label}</p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage = Math.min(
    100,
    Math.round((value / total) * 100)
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-[#52645B]">
          {label}
        </span>

        <span className="text-xs font-semibold text-[#71817A]">
          {value}/{total}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#EAF0EB]">
        <div
          className="h-full rounded-full bg-[#4F7C68] transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8A9891]">
        {label}
      </p>

      <div className="rounded-xl border border-[#DDE6DF] bg-[#F8FAF8] px-4 py-3 text-sm text-[#34453E]">
        {value}
      </div>
    </div>
  );
}

function SettingRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#DDE6DF] bg-white p-5">
      <div>
        <h3 className="font-semibold text-[#34453E]">
          {title}
        </h3>

        <p className="mt-0.5 text-xs text-[#8A9891]">
          {description}
        </p>
      </div>

      <button
        onClick={() => setEnabled((current) => !current)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-[#4F7C68]" : "bg-[#C8D1CB]"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}