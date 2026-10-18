import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  donorApi,
  DonationItem,
  CategoryItem,
  CommunityNeed,
  DonorStats,
  CategoryDistribution,
  SmartMatchItem,
} from "../services/api/donorApi";
import {
  DonorTab,
  DonationFilter,
  NeedPrefillData,
  DonorNotification,
} from "../components/donor/types";
import DonorSidebar from "../components/donor/DonorSidebar";
import DonorHeader from "../components/donor/DonorHeader";
import OverviewTab from "../components/donor/tabs/OverviewTab";
import PostDonationTab from "../components/donor/tabs/PostDonationTab";
import MyDonationsTab from "../components/donor/tabs/MyDonationsTab";
import RequestsTab from "../components/donor/tabs/RequestsTab";
import AccountTab from "../components/donor/tabs/AccountTab";
import DonationDetailsModal from "../components/donor/modals/DonationDetailsModal";
import EditDonationModal from "../components/donor/modals/EditDonationModal";
import NeedDetailsModal from "../components/donor/modals/NeedDetailsModal";
import ConfirmMatchModal from "../components/common/ConfirmMatchModal";
import { CheckCircle2, AlertCircle } from "lucide-react";
import "../styles/DonatorDashboard.css";

const initialStats: DonorStats = {
  totalDonations: 0,
  availableCount: 0,
  inProgressCount: 0,
  completedCount: 0,
  cancelledCount: 0,
  totalItemsDonated: 0,
  estimatedPeopleImpacted: 0,
};

export default function DonatorDashboard() {
  const { user, logout } = useAuth();

  // Language preference shared with the other pages through localStorage.
  const [language, setLanguage] = useState<"en" | "hi">(() =>
    localStorage.getItem("sahara-language") === "hi" ? "hi" : "en"
  );

  const t = {
    en: {
      language: "हिन्दी",
      dashboard: "Donor Dashboard",
      unavailable: "Unable to refresh some dashboard data",
      criticalNeed: "Critical Community Need",
      neededUrgently: "needed urgently in",
      nearbyArea: "nearby area",
      donationMatched: "Donation Matched",
      inTransit: "Donation In Transit",
      matchedBeneficiary: "matched with a beneficiary",
      volunteerDelivery: "out for volunteer delivery",
      deliveryCompleted: "Delivery Completed",
      deliveredVerified: "has been successfully delivered and verified.",
      justNow: "Just now",
      today: "Today",
      recent: "Recent",
      categoryCreated: "created successfully!",
      donationPublished: "Donation published successfully! It is now available for community pickup.",
      cancelled: "Donation cancelled successfully.",
      cancelFailed: "Failed to cancel donation",
      updated: "Donation updated successfully!",
      matchConfirmed: "Match confirmed! Delivery logistics dispatched.",
    },
    hi: {
      language: "English",
      dashboard: "दाता डैशबोर्ड",
      unavailable: "डैशबोर्ड का कुछ डेटा रीफ़्रेश नहीं हो सका",
      criticalNeed: "समुदाय की अत्यावश्यक ज़रूरत",
      neededUrgently: "की तुरंत आवश्यकता है —",
      nearbyArea: "आस-पास का क्षेत्र",
      donationMatched: "दान का मिलान हो गया",
      inTransit: "दान रास्ते में है",
      matchedBeneficiary: "लाभार्थी से मिलान हो गया है",
      volunteerDelivery: "स्वयंसेवक द्वारा पहुँचाया जा रहा है",
      deliveryCompleted: "डिलीवरी पूरी हुई",
      deliveredVerified: "सफलतापूर्वक पहुँचाया और सत्यापित किया गया है।",
      justNow: "अभी-अभी",
      today: "आज",
      recent: "हाल ही में",
      categoryCreated: "सफलतापूर्वक बनाई गई!",
      donationPublished: "दान सफलतापूर्वक प्रकाशित हुआ! अब समुदाय इसे प्राप्त कर सकता है।",
      cancelled: "दान सफलतापूर्वक रद्द किया गया।",
      cancelFailed: "दान रद्द नहीं हो सका",
      updated: "दान सफलतापूर्वक अपडेट हुआ!",
      matchConfirmed: "मिलान की पुष्टि हो गई! डिलीवरी की व्यवस्था भेज दी गई है।",
    },
  }[language];

  useEffect(() => {
    document.documentElement.lang = language === "hi" ? "hi" : "en";
  }, [language]);

  const toggleLanguage = () => {
    const next = language === "en" ? "hi" : "en";
    setLanguage(next);
    localStorage.setItem("sahara-language", next);
    document.documentElement.lang = next === "hi" ? "hi" : "en";
    window.dispatchEvent(new CustomEvent("sahara-language-change", { detail: next }));
  };

  // Navigation & UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DonorTab>("Overview");
  const [filter, setFilter] = useState<DonationFilter>("All");

  // Server data state
  const [stats, setStats] = useState<DonorStats>(initialStats);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution[]>([]);
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [communityNeeds, setCommunityNeeds] = useState<CommunityNeed[]>([]);
  const [smartMatches, setSmartMatches] = useState<SmartMatchItem[]>([]);

  // Modals & interaction state
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
  const [editingDonation, setEditingDonation] = useState<DonationItem | null>(null);
  const [selectedNeed, setSelectedNeed] = useState<CommunityNeed | null>(null);
  const [needPrefill, setNeedPrefill] = useState<NeedPrefillData | null>(null);
  const [matchToConfirm, setMatchToConfirm] = useState<SmartMatchItem | null>(null);

  // Status & notifications
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Fetch all dashboard data concurrently
  const loadDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);

    try {
      const [dashRes, myDonationsRes, categoriesRes, needsRes, matchesRes] = await Promise.allSettled([
        donorApi.getDashboard(),
        donorApi.getMyDonations(),
        donorApi.getCategories("active"),
        donorApi.getCommunityNeeds({ status: "open", limit: 20 }),
        donorApi.getSmartMatches(),
      ]);

      if (dashRes.status === "fulfilled" && dashRes.value?.success) {
        setStats(dashRes.value.stats || initialStats);
        setCategoryDistribution(dashRes.value.categoryDistribution || []);
      }

      if (myDonationsRes.status === "fulfilled" && myDonationsRes.value?.success) {
        setDonations(myDonationsRes.value.donations || []);
      }

      if (categoriesRes.status === "fulfilled" && categoriesRes.value?.success) {
        setCategories(categoriesRes.value.categories || []);
      }

      if (needsRes.status === "fulfilled" && needsRes.value?.success) {
        setCommunityNeeds(needsRes.value.needs || []);
      }

      if (matchesRes.status === "fulfilled" && matchesRes.value?.success) {
        setSmartMatches(matchesRes.value.matches || []);
      }
    } catch {
      showToast(t.unavailable, "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Dynamic notification list built from live status updates
  const notifications: DonorNotification[] = [
    ...communityNeeds
      .filter((n) => n.urgency === "critical")
      .map((n) => ({
        id: `need-${n._id}`,
        title: t.criticalNeed,
        message: language === "hi" ? `${n.title} (${n.quantity} ${n.unit}) ${t.neededUrgently} ${n.location?.city || t.nearbyArea}` : `${n.title} (${n.quantity} ${n.unit}) needed urgently in ${n.location?.city || t.nearbyArea}`,
        time: t.justNow,
        type: "warning" as const,
        read: false,
      })),
    ...donations
      .filter((d) => ["matched", "in_transit"].includes(d.status))
      .map((d) => ({
        id: `don-${d._id}`,
        title: d.status === "matched" ? t.donationMatched : t.inTransit,
        message: language === "hi" ? `आपका दान "${d.title}" अब ${d.status === "matched" ? t.matchedBeneficiary : t.volunteerDelivery}` : `Your donation "${d.title}" is now ${d.status === "matched" ? t.matchedBeneficiary : t.volunteerDelivery}`,
        time: t.today,
        type: "info" as const,
        read: false,
      })),
    ...donations
      .filter((d) => d.status === "completed")
      .slice(0, 2)
      .map((d) => ({
        id: `done-${d._id}`,
        title: t.deliveryCompleted,
        message: language === "hi" ? `"${d.title}" ${t.deliveredVerified}` : `"${d.title}" ${t.deliveredVerified}`,
        time: t.recent,
        type: "success" as const,
        read: true,
      })),
  ];

  const handleNavigateTab = (tab: DonorTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleCategoryCreated = (newCat: CategoryItem) => {
    setCategories((prev) => [newCat, ...prev]);
    showToast(language === "hi" ? `श्रेणी "${newCat.name}" ${t.categoryCreated}` : `Category "${newCat.name}" ${t.categoryCreated}`);
  };

  const handleDonationCreated = () => {
    showToast(t.donationPublished);
    loadDashboardData(true);
    setActiveTab("My Donations");
  };

  const handleFulfillNeed = (need: CommunityNeed) => {
    const categoryName = typeof need.categoryId === "object" ? need.categoryId?.name : "";
    const categoryId = typeof need.categoryId === "object" ? need.categoryId?._id : (need.categoryId ?? "");

    setNeedPrefill({
      needId: need._id,
      title: need.title,
      categoryId,
      categoryName,
      quantity: need.quantity,
      unit: need.unit,
      description: need.description,
    });

    setActiveTab("Post Donation");
    setSelectedNeed(null);
  };

  const userName = user?.name || "Donor";
  const urgentNeedsCount = communityNeeds.filter((n) => ["critical", "high"].includes(n.urgency)).length;

  return (
    <div className="sd" lang={language === "hi" ? "hi" : "en"}>
      <button
        type="button"
        onClick={toggleLanguage}
        aria-label={language === "en" ? "Switch language to Hindi" : "भाषा English में बदलें"}
        style={{ position: "fixed", top: 16, right: 18, zIndex: 1001, border: "1px solid #cbd5d1", borderRadius: 10, padding: "8px 12px", background: "#ffffff", color: "#0b5563", fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        {t.language}
      </button>
      {/* Toast Notification Banner */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 20px",
            borderRadius: "12px",
            background: toast.type === "success" ? "#0b5563" : "#991b1b",
            color: "#ffffff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            fontSize: "14px",
            fontWeight: 500,
            animation: "sd-pop 0.25s ease",
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} color="#8be0a0" />
          ) : (
            <AlertCircle size={18} color="#fca5a5" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Responsive Sidebar */}
      <DonorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        navigateTab={handleNavigateTab}
        userName={userName}
        urgentNeedsCount={urgentNeedsCount}
        onLogout={logout}
      />

      <div className="sd-shell">
        {/* Sticky Header */}
        <DonorHeader
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
          onPostClick={() => setActiveTab("Post Donation")}
          onRefresh={() => loadDashboardData(true)}
          refreshing={refreshing}
          notifications={notifications}
        />

        {/* Tab Content Router */}
        <main className="sd-main">
          {activeTab === "Overview" && (
            <OverviewTab
              userName={userName}
              stats={stats}
              categoryDistribution={categoryDistribution}
              recentDonations={donations}
              recentNeeds={communityNeeds}
              smartMatches={smartMatches}
              onNavigateTab={handleNavigateTab}
              onViewDonation={setSelectedDonation}
              onViewNeed={setSelectedNeed}
              onSelectMatch={(m) => setMatchToConfirm(m)}
              loading={loading}
            />
          )}

          {activeTab === "Post Donation" && (
            <PostDonationTab
              categories={categories}
              onCategoryCreated={handleCategoryCreated}
              onSuccess={handleDonationCreated}
              onCancel={() => {
                setNeedPrefill(null);
                setActiveTab("Overview");
              }}
              userLocation={user?.location}
              needPrefill={needPrefill}
              onClearPrefill={() => setNeedPrefill(null)}
            />
          )}

          {activeTab === "My Donations" && (
            <MyDonationsTab
              donations={donations}
              filter={filter}
              setFilter={setFilter}
              onViewDonation={setSelectedDonation}
              onEditDonation={setEditingDonation}
              onPostClick={() => setActiveTab("Post Donation")}
              onRefresh={() => loadDashboardData(true)}
            />
          )}

          {activeTab === "Requests" && (
            <RequestsTab
              needs={communityNeeds}
              loading={loading}
              onViewNeed={setSelectedNeed}
              onFulfillNeed={handleFulfillNeed}
              onRefresh={() => loadDashboardData(true)}
            />
          )}

          {activeTab === "Account" && (
            <AccountTab
              user={user}
              onLogout={logout}
            />
          )}
        </main>
      </div>

      {/* Details Modal */}
      {selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
          onEdit={(d) => {
            setSelectedDonation(null);
            setEditingDonation(d);
          }}
          onCancelDonation={async (id) => {
            try {
              await donorApi.updateDonation(id, { status: "cancelled" });
              showToast(t.cancelled);
              setSelectedDonation(null);
              loadDashboardData(true);
            } catch (err: any) {
              alert(err?.message || t.cancelFailed);
            }
          }}
        />
      )}

      {/* Edit Modal */}
      {editingDonation && (
        <EditDonationModal
          donation={editingDonation}
          onClose={() => setEditingDonation(null)}
          onSuccess={() => {
            showToast(t.updated);
            loadDashboardData(true);
          }}
        />
      )}

      {/* Community Need Modal */}
      {selectedNeed && (
        <NeedDetailsModal
          need={selectedNeed}
          onClose={() => setSelectedNeed(null)}
          onFulfill={handleFulfillNeed}
        />
      )}

      {/* Smart Match & Logistics Confirmation Modal */}
      {matchToConfirm && (
        <ConfirmMatchModal
          isOpen={Boolean(matchToConfirm)}
          onClose={() => setMatchToConfirm(null)}
          donation={matchToConfirm.donation}
          need={matchToConfirm.need}
          score={matchToConfirm.score}
          initialMode={matchToConfirm.logistics?.recommendedMode || "volunteer_delivery"}
          currentRole="donor"
          onConfirmSuccess={(res) => {
            showToast(res.message || t.matchConfirmed);
            loadDashboardData(true);
          }}
        />
      )}
    </div>
  );
}