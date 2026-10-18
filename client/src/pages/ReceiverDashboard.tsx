import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  receiverApi,
  ReceiverNeedItem,
  ReceiverStats,
  UrgencyDistribution,
  ReceiverSmartMatchItem,
} from "../services/api/receiverApi";
import {
  DonationItem,
  CategoryItem,
} from "../services/api/donorApi";
import {
  ReceiverTab,
  NeedFilter,
  RequestPrefillDonation,
  ReceiverNotification,
} from "../components/receiver/types";
import ReceiverSidebar from "../components/receiver/ReceiverSidebar";
import ReceiverHeader from "../components/receiver/ReceiverHeader";
import OverviewTab from "../components/receiver/tabs/OverviewTab";
import FindDonationsTab from "../components/receiver/tabs/FindDonationsTab";
import RaiseNeedTab from "../components/receiver/tabs/RaiseNeedTab";
import MyRequestsTab from "../components/receiver/tabs/MyRequestsTab";
import AccountTab from "../components/receiver/tabs/AccountTab";
import DonationDetailsModal from "../components/receiver/modals/DonationDetailsModal";
import NeedDetailsModal from "../components/receiver/modals/NeedDetailsModal";
import EditNeedModal from "../components/receiver/modals/EditNeedModal";
import ConfirmMatchModal from "../components/common/ConfirmMatchModal";
import { CheckCircle2, AlertCircle } from "lucide-react";
import "../styles/ReceiverDashboard.css";

const initialStats: ReceiverStats = {
  totalNeeds: 0,
  openCount: 0,
  inProgressCount: 0,
  fulfilledCount: 0,
  cancelledCount: 0,
  totalItemsRequested: 0,
};

export default function ReceiverDashboard() {
  const { user, logout } = useAuth();

  // Language preference (shared localStorage key used by other pages)
  const [language, setLanguage] = useState<"en" | "hi">(() =>
    localStorage.getItem("sahara-language") === "hi" ? "hi" : "en"
  );
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
  const text = {
    en: { language: "हिन्दी", loadingError: "Unable to refresh some dashboard data",
      newDonation: "New Surplus Donation Ready", outForDelivery: "Out for Delivery",
      requestMatched: "Request Matched", recent: "Recent", today: "Today",
      categoryCreated: (name: string) => `Category "${name}" created successfully!`,
      needSubmitted: "Need request submitted successfully! Donors and volunteers can now see your requirement.",
      needCancelled: "Need request cancelled successfully.", needUpdated: "Need request updated successfully!",
      cancelFailed: "Failed to cancel request", matchConfirmed: "Match confirmed! Delivery scheduled." },
    hi: { language: "English", loadingError: "डैशबोर्ड का कुछ डेटा रीफ़्रेश नहीं हो सका",
      newDonation: "अतिरिक्त दान उपलब्ध है", outForDelivery: "डिलीवरी के लिए रवाना",
      requestMatched: "अनुरोध का मिलान हो गया", recent: "हाल ही में", today: "आज",
      categoryCreated: (name: string) => `श्रेणी "${name}" सफलतापूर्वक बनाई गई!`,
      needSubmitted: "ज़रूरत का अनुरोध सफलतापूर्वक भेज दिया गया! अब दानदाता और स्वयंसेवक आपकी आवश्यकता देख सकते हैं।",
      needCancelled: "ज़रूरत का अनुरोध रद्द कर दिया गया।", needUpdated: "ज़रूरत का अनुरोध सफलतापूर्वक अपडेट हुआ!",
      cancelFailed: "अनुरोध रद्द नहीं हो सका", matchConfirmed: "मिलान की पुष्टि हो गई! डिलीवरी निर्धारित है।" }
  }[language];

  // Navigation & UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ReceiverTab>("Overview");
  const [filter, setFilter] = useState<NeedFilter>("All");

  // Server data state
  const [stats, setStats] = useState<ReceiverStats>(initialStats);
  const [urgencyDistribution, setUrgencyDistribution] = useState<UrgencyDistribution[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<Array<{ categoryId: string; categoryName: string; count: number; totalQuantity: number }>>([]);
  const [myNeeds, setMyNeeds] = useState<ReceiverNeedItem[]>([]);
  const [availableDonations, setAvailableDonations] = useState<DonationItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [smartMatches, setSmartMatches] = useState<ReceiverSmartMatchItem[]>([]);

  // Modals & interaction state
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
  const [selectedNeed, setSelectedNeed] = useState<ReceiverNeedItem | null>(null);
  const [editingNeed, setEditingNeed] = useState<ReceiverNeedItem | null>(null);
  const [prefillDonation, setPrefillDonation] = useState<RequestPrefillDonation | null>(null);
  const [matchToConfirm, setMatchToConfirm] = useState<ReceiverSmartMatchItem | null>(null);

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
      const [dashRes, myNeedsRes, donationsRes, categoriesRes, matchesRes] = await Promise.allSettled([
        receiverApi.getDashboard(),
        receiverApi.getMyNeeds(),
        receiverApi.getAvailableDonations({ limit: 50 }),
        receiverApi.getCategories("active"),
        receiverApi.getSmartMatches(),
      ]);

      if (dashRes.status === "fulfilled" && dashRes.value?.success) {
        setStats(dashRes.value.stats || initialStats);
        setUrgencyDistribution(dashRes.value.urgencyDistribution || []);
        setCategoryDistribution(dashRes.value.categoryDistribution || []);
      }

      if (myNeedsRes.status === "fulfilled" && myNeedsRes.value?.success) {
        setMyNeeds(myNeedsRes.value.needs || []);
      }

      if (donationsRes.status === "fulfilled" && donationsRes.value?.success) {
        setAvailableDonations(donationsRes.value.donations || []);
      }

      if (categoriesRes.status === "fulfilled" && categoriesRes.value?.success) {
        setCategories(categoriesRes.value.categories || []);
      }

      if (matchesRes.status === "fulfilled" && matchesRes.value?.success) {
        setSmartMatches(matchesRes.value.matches || []);
      }
    } catch {
      showToast(text.loadingError, "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Dynamic notifications for receiver
  const notifications: ReceiverNotification[] = [
    ...availableDonations.slice(0, 2).map((d) => ({
      id: `avail-${d._id}`,
      title: text.newDonation,
      message: `"${d.title}" (${d.quantity} ${d.unit}) is available in ${d.location?.city || "nearby area"}`,
      time: text.recent,
      type: "info" as const,
      read: false,
    })),
    ...myNeeds
      .filter((n) => ["matched", "accepted", "in_transit"].includes(n.status))
      .map((n) => ({
        id: `need-${n._id}`,
        title: n.status === "in_transit" ? text.outForDelivery : text.requestMatched,
        message: `Your request "${n.title}" has been ${n.status === "in_transit" ? "dispatched with a volunteer" : "matched with a donor"}`,
        time: text.today,
        type: "success" as const,
        read: false,
      })),
  ];

  const handleNavigateTab = (tab: ReceiverTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleCategoryCreated = (newCat: CategoryItem) => {
    setCategories((prev) => [newCat, ...prev]);
    showToast(text.categoryCreated(newCat.name));
  };

  const handleNeedCreated = () => {
    showToast(text.needSubmitted);
    loadDashboardData(true);
    setActiveTab("My Requests");
  };

  const handleRequestDonation = (donation: DonationItem) => {
    const categoryName = typeof donation.categoryId === "object" ? donation.categoryId?.name : "";
    const categoryId = typeof donation.categoryId === "object" ? donation.categoryId?._id : (donation.categoryId ?? "");

    // Check if the receiver has an open need in this category to match directly
    const matchingOpenNeed = myNeeds.find((n) => {
      const needCatId = typeof n.categoryId === "object" ? n.categoryId?._id : n.categoryId;
      return n.status === "open" && needCatId === categoryId;
    });

    if (matchingOpenNeed) {
      setMatchToConfirm({
        matchId: `${donation._id}_${matchingOpenNeed._id}`,
        score: 95,
        need: {
          _id: matchingOpenNeed._id,
          title: matchingOpenNeed.title,
          quantity: matchingOpenNeed.quantity,
          unit: matchingOpenNeed.unit,
          urgency: matchingOpenNeed.urgency,
          category: categoryName,
          location: matchingOpenNeed.location,
          requiredBy: matchingOpenNeed.requiredBy,
        },
        donation: {
          _id: donation._id,
          title: donation.title,
          quantity: donation.quantity,
          unit: donation.unit,
          category: categoryName,
          donorName: typeof donation.donorId === "object" ? donation.donorId?.name : "Community Donor",
          location: donation.location,
          availableUntil: donation.availableUntil,
          foodDetails: donation.foodDetails,
        },
        logistics: {
          recommendedMode: (matchingOpenNeed.deliveryPreference && matchingOpenNeed.deliveryPreference !== "any")
            ? (matchingOpenNeed.deliveryPreference as any)
            : "volunteer_delivery",
          label: "Recommended Logistics",
          description: "Matched with your existing open request.",
        },
      });
      setSelectedDonation(null);
      return;
    }

    setPrefillDonation({
      donationId: donation._id,
      title: donation.title,
      categoryId,
      categoryName,
      quantity: donation.quantity,
      unit: donation.unit,
      description: donation.description,
    });

    setActiveTab("Raise Need");
    setSelectedDonation(null);
  };

  const userName = user?.name || "Receiver";
  const openNeedsCount = myNeeds.filter((n) => n.status === "open").length;

  return (
    <div className="rd" lang={language === "hi" ? "hi" : "en"}>
      <button
        type="button"
        onClick={toggleLanguage}
        aria-label={language === "en" ? "Switch language to Hindi" : "भाषा अंग्रेज़ी में बदलें"}
        style={{ position: "fixed", top: "16px", right: "18px", zIndex: 1200, border: "1px solid #cbd5d1", borderRadius: "10px", background: "#ffffff", color: "#0b5563", padding: "8px 13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 3px 12px rgba(0,0,0,0.08)" }}
      >
        {text.language}
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
            animation: "rd-pop 0.25s ease",
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
      <ReceiverSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        navigateTab={handleNavigateTab}
        userName={userName}
        openNeedsCount={openNeedsCount}
        availableDonationsCount={availableDonations.length}
        onLogout={logout}
      />

      <div className="rd-shell">
        {/* Sticky Header */}
        <ReceiverHeader
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
          onRaiseNeedClick={() => setActiveTab("Raise Need")}
          onRefresh={() => loadDashboardData(true)}
          refreshing={refreshing}
          notifications={notifications}
        />

        {/* Tab Content Router */}
        <main className="rd-main">
          {activeTab === "Overview" && (
            <OverviewTab
              userName={userName}
              stats={stats}
              categoryDistribution={categoryDistribution}
              availableDonations={availableDonations}
              recentNeeds={myNeeds}
              smartMatches={smartMatches}
              onNavigateTab={handleNavigateTab}
              onViewDonation={setSelectedDonation}
              onRequestDonation={handleRequestDonation}
              onViewNeed={setSelectedNeed}
              onSelectMatch={(m) => setMatchToConfirm(m)}
              loading={loading}
            />
          )}

          {activeTab === "Find Donations" && (
            <FindDonationsTab
              donations={availableDonations}
              loading={loading}
              onViewDonation={setSelectedDonation}
              onRequestDonation={handleRequestDonation}
              onRefresh={() => loadDashboardData(true)}
            />
          )}

          {activeTab === "Raise Need" && (
            <RaiseNeedTab
              categories={categories}
              onCategoryCreated={handleCategoryCreated}
              onSuccess={handleNeedCreated}
              onCancel={() => {
                setPrefillDonation(null);
                setActiveTab("Overview");
              }}
              userLocation={user?.location}
              userReceiverType={user?.receiverType}
              prefillDonation={prefillDonation}
              onClearPrefill={() => setPrefillDonation(null)}
            />
          )}

          {activeTab === "My Requests" && (
            <MyRequestsTab
              needs={myNeeds}
              filter={filter}
              setFilter={setFilter}
              onViewNeed={setSelectedNeed}
              onEditNeed={setEditingNeed}
              onRaiseNeedClick={() => setActiveTab("Raise Need")}
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

      {/* Donation Details Modal */}
      {selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
          onRequestDonation={handleRequestDonation}
        />
      )}

      {/* Need Details Modal */}
      {selectedNeed && (
        <NeedDetailsModal
          need={selectedNeed}
          onClose={() => setSelectedNeed(null)}
          onEdit={(n) => {
            setSelectedNeed(null);
            setEditingNeed(n);
          }}
          onCancelNeed={async (id) => {
            try {
              await receiverApi.updateNeed(id, { status: "cancelled" });
              showToast(text.needCancelled);
              setSelectedNeed(null);
              loadDashboardData(true);
            } catch (err: any) {
              alert(err?.message || text.cancelFailed);
            }
          }}
        />
      )}

      {/* Edit Need Modal */}
      {editingNeed && (
        <EditNeedModal
          need={editingNeed}
          onClose={() => setEditingNeed(null)}
          onSuccess={() => {
            showToast(text.needUpdated);
            loadDashboardData(true);
          }}
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
          currentRole="receiver"
          onConfirmSuccess={(res) => {
            showToast(res.message || text.matchConfirmed);
            loadDashboardData(true);
          }}
        />
      )}
    </div>
  );
}