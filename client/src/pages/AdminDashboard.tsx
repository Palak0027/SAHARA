import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  AlertTriangle,
  X,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  ClipboardList,
  UserCheck,
  BarChart3,
  UserCog
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { adminApi, type AdminStatsResponse } from "../services/api/admin";

import type { Tab, NavItem } from "../components/admin/types";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminHeader } from "../components/admin/AdminHeader";
import { OverviewTab } from "../components/admin/tabs/OverviewTab";
import { UsersTab } from "../components/admin/tabs/UsersTab";
import { VerificationsTab } from "../components/admin/tabs/VerificationsTab";
import { DonationsTab } from "../components/admin/tabs/DonationsTab";
import { RequestsTab } from "../components/admin/tabs/RequestsTab";
import { VolunteersTab } from "../components/admin/tabs/VolunteersTab";
import { ReportsTab } from "../components/admin/tabs/ReportsTab";
import { AccountTab } from "../components/admin/tabs/AccountTab";
import { CreateVolunteerModal } from "../components/admin/modals/CreateVolunteerModal";
import { DispatchTaskModal } from "../components/admin/modals/DispatchTaskModal";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Live Backend Data States
  const [stats, setStats] = useState<AdminStatsResponse["stats"] | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [verificationsList, setVerificationsList] = useState<any[]>([]);
  const [donationsList, setDonationsList] = useState<any[]>([]);
  const [needsList, setNeedsList] = useState<any[]>([]);
  const [volunteersList, setVolunteersList] = useState<any[]>([]);
  const [tasksList, setTasksList] = useState<any[]>([]);

  // Search & Filter States
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [donationSearch, setDonationSearch] = useState("");
  const [donationStatusFilter, setDonationStatusFilter] = useState("all");
  const [needUrgencyFilter, setNeedUrgencyFilter] = useState("all");

  // Modals
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showCreateVolunteerModal, setShowCreateVolunteerModal] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    city: "New Delhi",
    address: "",
    vehicleType: "two_wheeler",
    availability: true
  });

  const [dispatchForm, setDispatchForm] = useState({
    title: "",
    description: "",
    volunteerId: "",
    donationId: "",
    needId: "",
    scheduledTime: "Today · 4:00 PM",
    urgency: "medium",
    peopleNeeded: 1
  });

  const showAlert = (type: "success" | "error", text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => {
      setAlertMessage(null);
    }, 4500);
  };

  // Fetch all live dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, verifRes, donRes, needsRes, volRes, tasksRes] =
        await Promise.all([
          adminApi.getStats().catch(() => null),
          adminApi.getUsers({ limit: 50 }).catch(() => null),
          adminApi.getVerifications({ status: "all" }).catch(() => null),
          adminApi.getDonations({ limit: 50 }).catch(() => null),
          adminApi.getNeeds({ limit: 50 }).catch(() => null),
          adminApi.getVolunteers().catch(() => null),
          adminApi.getTasks({ limit: 50 }).catch(() => null)
        ]);

      if (statsRes?.success) setStats(statsRes.stats);
      if (usersRes?.success) setUsersList(usersRes.users);
      if (verifRes?.success) setVerificationsList(verifRes.organizations);
      if (donRes?.success) setDonationsList(donRes.donations);
      if (needsRes?.success) setNeedsList(needsRes.needs);
      if (volRes?.success) setVolunteersList(volRes.volunteers);
      if (tasksRes?.success) setTasksList(tasksRes.tasks);
    } catch (err: any) {
      showAlert("error", err?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Pending Verifications Count
  const pendingVerificationsCount = useMemo(() => {
    return verificationsList.filter(
      (org) => org.organization?.verificationStatus === "pending"
    ).length;
  }, [verificationsList]);

  // Sidebar navigation items
  const nav: NavItem[] = useMemo(
    () => [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Users", icon: Users },
      {
        label: "Verifications",
        icon: ShieldCheck,
        badge: pendingVerificationsCount > 0 ? pendingVerificationsCount : undefined
      },
      { label: "Donations", icon: Package },
      { label: "Requests", icon: ClipboardList },
      { label: "Volunteers", icon: UserCheck },
      { label: "Reports", icon: BarChart3 },
      { label: "Account", icon: UserCog }
    ],
    [pendingVerificationsCount]
  );

  // User status toggle (Block / Activate)
  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setActionLoading(true);
    try {
      const res = await adminApi.toggleUserStatus(userId, !currentStatus);
      if (res.success) {
        showAlert("success", res.message || "User status updated successfully");
        setUsersList((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: !currentStatus } : u))
        );
        adminApi.getStats().then((s) => s?.success && setStats(s.stats));
      }
    } catch (err: any) {
      showAlert("error", err?.response?.data?.message || "Failed to update user status");
    } finally {
      setActionLoading(false);
    }
  };

  // NGO Verification (Approve / Reject)
  const handleVerificationDecision = async (
    org: any,
    status: "verified" | "rejected",
    reason?: string
  ) => {
    setActionLoading(true);
    try {
      const res = await adminApi.updateVerification(org._id, {
        status,
        rejectionReason: reason
      });
      if (res.success) {
        showAlert("success", `Organization marked as ${status.toUpperCase()}`);
        setVerificationsList((prev) =>
          prev.map((item) =>
            item._id === org._id
              ? {
                ...item,
                organization: { ...item.organization, verificationStatus: status }
              }
              : item
          )
        );
        adminApi.getStats().then((s) => s?.success && setStats(s.stats));
      }
    } catch (err: any) {
      showAlert("error", err?.response?.data?.message || "Verification update failed");
    } finally {
      setActionLoading(false);
    }
  };

  // Donation Status Update
  const handleUpdateDonationStatus = async (donationId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await adminApi.updateDonationStatus(donationId, newStatus);
      if (res.success) {
        showAlert("success", "Donation status updated");
        setDonationsList((prev) =>
          prev.map((d) => (d._id === donationId ? { ...d, status: newStatus } : d))
        );
        adminApi.getStats().then((s) => s?.success && setStats(s.stats));
      }
    } catch (err: any) {
      showAlert("error", err?.response?.data?.message || "Failed to update donation");
    } finally {
      setActionLoading(false);
    }
  };

  // Need Status Update
  const handleUpdateNeedStatus = async (needId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await adminApi.updateNeedStatus(needId, newStatus);
      if (res.success) {
        showAlert("success", "Need status updated");
        setNeedsList((prev) =>
          prev.map((n) => (n._id === needId ? { ...n, status: newStatus } : n))
        );
        adminApi.getStats().then((s) => s?.success && setStats(s.stats));
      }
    } catch (err: any) {
      showAlert("error", err?.response?.data?.message || "Failed to update need");
    } finally {
      setActionLoading(false);
    }
  };

  // Create Volunteer Dispatch Task
  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchForm.title.trim()) {
      showAlert("error", "Task title is required");
      return;
    }
    setActionLoading(true);
    try {
      const res = await adminApi.dispatchTask({
        title: dispatchForm.title,
        description: dispatchForm.description,
        volunteerId: dispatchForm.volunteerId || undefined,
        donationId: dispatchForm.donationId || undefined,
        needId: dispatchForm.needId || undefined,
        scheduledTime: dispatchForm.scheduledTime,
        urgency: dispatchForm.urgency,
        peopleNeeded: Number(dispatchForm.peopleNeeded)
      });
      if (res.success) {
        showAlert("success", "Volunteer Task dispatched successfully!");
        setShowDispatchModal(false);
        setDispatchForm({
          title: "",
          description: "",
          volunteerId: "",
          donationId: "",
          needId: "",
          scheduledTime: "Today · 4:00 PM",
          urgency: "medium",
          peopleNeeded: 1
        });
        loadDashboardData();
      }
    } catch (err: any) {
      showAlert("error", err?.response?.data?.message || "Failed to dispatch task");
    } finally {
      setActionLoading(false);
    }
  };

  // Create New Volunteer
  const handleCreateVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !volunteerForm.name.trim() ||
      !volunteerForm.phone.trim() ||
      !volunteerForm.password.trim()
    ) {
      showAlert("error", "Name, phone, and password are required");
      return;
    }
    setModalError(null);
    setActionLoading(true);
    try {
      const res = await adminApi.createVolunteer({
        name: volunteerForm.name,
        phone: volunteerForm.phone,
        email: volunteerForm.email || undefined,
        password: volunteerForm.password,
        location: {
          city: volunteerForm.city,
          address: volunteerForm.address
        },
        vehicleType: volunteerForm.vehicleType,
        availability: volunteerForm.availability
      });
      if (res.success) {
        showAlert("success", res.message || "Volunteer onboarded successfully!");
        setShowCreateVolunteerModal(false);
        setModalError(null);
        setVolunteerForm({
          name: "",
          phone: "",
          email: "",
          password: "",
          city: "New Delhi",
          address: "",
          vehicleType: "two_wheeler",
          availability: true
        });
        loadDashboardData();
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to create volunteer";
      setModalError(errMsg);
      showAlert("error", errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((item) => {
      const query = userSearch.toLowerCase();
      const matchesSearch =
        item.name?.toLowerCase().includes(query) ||
        item.phone?.includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.role?.toLowerCase().includes(query);

      const matchesRole = userRoleFilter === "all" || item.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [usersList, userSearch, userRoleFilter]);

  // Filtered Donations
  const filteredDonations = useMemo(() => {
    return donationsList.filter((item) => {
      const query = donationSearch.toLowerCase();
      const matchesSearch =
        item.title?.toLowerCase().includes(query) ||
        item.donorId?.name?.toLowerCase().includes(query) ||
        item.location?.city?.toLowerCase().includes(query);

      const matchesStatus =
        donationStatusFilter === "all" || item.status === donationStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [donationsList, donationSearch, donationStatusFilter]);

  // Filtered Needs
  const filteredNeeds = useMemo(() => {
    return needsList.filter((item) => {
      if (needUrgencyFilter === "all") return true;
      return item.urgency === needUrgencyFilter;
    });
  }, [needsList, needUrgencyFilter]);

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#26332F]">
      {/* Toast Alert - Always on Top with high z-index */}
      {alertMessage && (
        <div
          className={`fixed right-6 top-6 z-[99999] flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl transition-all border ${alertMessage.type === "success"
            ? "bg-[#1E4336] text-white border-emerald-500/40"
            : "bg-[#991B1B] text-white border-red-400/50"
            }`}
          style={{ zIndex: 99999 }}
        >
          {alertMessage.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-emerald-300 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-200 shrink-0" />
          )}
          <span className="text-sm font-semibold tracking-wide">
            {alertMessage.text}
          </span>
          <button
            onClick={() => setAlertMessage(null)}
            className="ml-2 rounded-lg p-1 text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        logout={logout}
        nav={nav}
      />

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 lg:pl-64">
        {/* Header Bar */}
        <AdminHeader
          activeTab={activeTab}
          loading={loading}
          onRefresh={loadDashboardData}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenDispatch={() => setShowDispatchModal(true)}
        />

        {/* Tab Contents */}
        <main className="p-4 sm:p-6 max-w-7xl mx-auto">
          {activeTab === "Overview" && (
            <OverviewTab
              stats={stats}
              usersList={usersList}
              needsList={needsList}
              volunteersList={volunteersList}
              tasksList={tasksList}
              pendingVerificationsCount={pendingVerificationsCount}
              onNavigateTab={setActiveTab}
              onOpenDispatchForNeed={(need) => {
                setDispatchForm((prev) => ({
                  ...prev,
                  needId: need._id,
                  title: `Dispatch for: ${need.title}`
                }));
                setShowDispatchModal(true);
              }}
            />
          )}

          {activeTab === "Users" && (
            <UsersTab
              filteredUsers={filteredUsers}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              userRoleFilter={userRoleFilter}
              setUserRoleFilter={setUserRoleFilter}
              onToggleUserStatus={handleToggleUserStatus}
              actionLoading={actionLoading}
            />
          )}

          {activeTab === "Verifications" && (
            <VerificationsTab
              verificationsList={verificationsList}
              onVerificationDecision={handleVerificationDecision}
              actionLoading={actionLoading}
            />
          )}

          {activeTab === "Donations" && (
            <DonationsTab
              filteredDonations={filteredDonations}
              donationSearch={donationSearch}
              setDonationSearch={setDonationSearch}
              donationStatusFilter={donationStatusFilter}
              setDonationStatusFilter={setDonationStatusFilter}
              onUpdateDonationStatus={handleUpdateDonationStatus}
              onOpenDispatchForDonation={(donation) => {
                setDispatchForm((prev) => ({
                  ...prev,
                  donationId: donation._id,
                  title: `Collect & Distribute: ${donation.title}`
                }));
                setShowDispatchModal(true);
              }}
            />
          )}

          {activeTab === "Requests" && (
            <RequestsTab
              filteredNeeds={filteredNeeds}
              needUrgencyFilter={needUrgencyFilter}
              setNeedUrgencyFilter={setNeedUrgencyFilter}
              onUpdateNeedStatus={handleUpdateNeedStatus}
              onOpenDispatchForNeed={(need) => {
                setDispatchForm((prev) => ({
                  ...prev,
                  needId: need._id,
                  title: `Fulfill Need: ${need.title}`
                }));
                setShowDispatchModal(true);
              }}
            />
          )}

          {activeTab === "Volunteers" && (
            <VolunteersTab
              volunteersList={volunteersList}
              tasksList={tasksList}
              onOpenCreateVolunteer={() => {
                setModalError(null);
                setShowCreateVolunteerModal(true);
              }}
              onOpenDispatchModal={(volunteerId) => {
                if (volunteerId) {
                  setDispatchForm((prev) => ({
                    ...prev,
                    volunteerId
                  }));
                }
                setShowDispatchModal(true);
              }}
            />
          )}

          {activeTab === "Reports" && (
            <ReportsTab
              verificationsList={verificationsList}
              pendingVerificationsCount={pendingVerificationsCount}
            />
          )}

          {activeTab === "Account" && (
            <AccountTab user={user} onLogout={logout} />
          )}
        </main>
      </div>

      {/* DISPATCH TASK MODAL */}
      <DispatchTaskModal
        isOpen={showDispatchModal}
        onClose={() => setShowDispatchModal(false)}
        form={dispatchForm}
        setForm={setDispatchForm}
        volunteersList={volunteersList}
        donationsList={donationsList}
        needsList={needsList}
        actionLoading={actionLoading}
        onSubmit={handleDispatchSubmit}
      />

      {/* ONBOARD VOLUNTEER MODAL */}
      <CreateVolunteerModal
        isOpen={showCreateVolunteerModal}
        onClose={() => setShowCreateVolunteerModal(false)}
        form={volunteerForm}
        setForm={setVolunteerForm}
        modalError={modalError}
        actionLoading={actionLoading}
        onSubmit={handleCreateVolunteerSubmit}
      />
    </div>
  );
}