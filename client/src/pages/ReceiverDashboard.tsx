import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  receiverApi,
  ReceiverNeedItem,
  ReceiverStats,
  UrgencyDistribution,
  ReceiverSmartMatchItem,
} from "../services/api/receiverApi";
import { DonationItem, CategoryItem } from "../services/api/donorApi";
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

type Language = "en" | "hi";

const initialStats: ReceiverStats = {
  totalNeeds: 0,
  openCount: 0,
  inProgressCount: 0,
  fulfilledCount: 0,
  cancelledCount: 0,
  totalItemsRequested: 0,
};

const translations = {
  en: {
    loadingError: "Unable to refresh some dashboard data",
    newDonation: "New Surplus Donation Ready",
    outForDelivery: "Out for Delivery",
    requestMatched: "Request Matched",
    recent: "Recent",
    today: "Today",
    nearbyArea: "nearby area",
    categoryCreated: (name: string) =>
      `Category "${name}" created successfully!`,
    needSubmitted:
      "Need request submitted successfully! Donors and volunteers can now see your requirement.",
    needCancelled: "Need request cancelled successfully.",
    needUpdated: "Need request updated successfully!",
    cancelFailed: "Failed to cancel request",
    matchConfirmed: "Match confirmed! Delivery scheduled.",
    dispatched: "dispatched with a volunteer",
    matched: "matched with a donor",
    recommendedLogistics: "Recommended Logistics",
    matchedExistingRequest: "Matched with your existing open request.",
    communityDonor: "Community Donor",
  },
  hi: {
    loadingError: "डैशबोर्ड का कुछ डेटा रीफ़्रेश नहीं हो सका",
    newDonation: "अतिरिक्त दान उपलब्ध है",
    outForDelivery: "डिलीवरी के लिए रवाना",
    requestMatched: "अनुरोध का मिलान हो गया",
    recent: "हाल ही में",
    today: "आज",
    nearbyArea: "आस-पास का क्षेत्र",
    categoryCreated: (name: string) =>
      `श्रेणी "${name}" सफलतापूर्वक बनाई गई!`,
    needSubmitted:
      "ज़रूरत का अनुरोध सफलतापूर्वक भेज दिया गया! अब दानदाता और स्वयंसेवक आपकी आवश्यकता देख सकते हैं।",
    needCancelled: "ज़रूरत का अनुरोध रद्द कर दिया गया।",
    needUpdated: "ज़रूरत का अनुरोध सफलतापूर्वक अपडेट हुआ!",
    cancelFailed: "अनुरोध रद्द नहीं हो सका",
    matchConfirmed: "मिलान की पुष्टि हो गई! डिलीवरी निर्धारित है।",
    dispatched: "स्वयंसेवक के साथ भेज दिया गया",
    matched: "दानदाता के साथ मिलान हो गया",
    recommendedLogistics: "अनुशंसित डिलीवरी व्यवस्था",
    matchedExistingRequest: "आपके पहले से मौजूद खुले अनुरोध से मिलान हुआ।",
    communityDonor: "समुदाय का दानदाता",
  },
};

export default function ReceiverDashboard() {
  const { user, logout } = useAuth();

  // Shared language preference
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem("sahara-language") === "hi" ? "hi" : "en";
  });

  const text = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;

    const syncLanguage = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === "en" || next === "hi") {
        setLanguage(next);
      }
    };

    window.addEventListener("sahara-language-change", syncLanguage);

    return () => {
      window.removeEventListener("sahara-language-change", syncLanguage);
    };
  }, [language]);

  const toggleLanguage = useCallback(() => {
    const next: Language = language === "en" ? "hi" : "en";

    localStorage.setItem("sahara-language", next);
    document.documentElement.lang = next;
    setLanguage(next);

    window.dispatchEvent(
      new CustomEvent("sahara-language-change", { detail: next })
    );
  }, [language]);

  // Navigation
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ReceiverTab>("Overview");
  const [filter, setFilter] = useState<NeedFilter>("All");

  // Dashboard data
  const [stats, setStats] = useState<ReceiverStats>(initialStats);
  const [urgencyDistribution, setUrgencyDistribution] = useState<
    UrgencyDistribution[]
  >([]);

  const [categoryDistribution, setCategoryDistribution] = useState<
    Array<{
      categoryId: string;
      categoryName: string;
      count: number;
      totalQuantity: number;
    }>
  >([]);

  const [myNeeds, setMyNeeds] = useState<ReceiverNeedItem[]>([]);
  const [availableDonations, setAvailableDonations] = useState<DonationItem[]>(
    []
  );
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [smartMatches, setSmartMatches] = useState<
    ReceiverSmartMatchItem[]
  >([]);

  // Modal state
  const [selectedDonation, setSelectedDonation] =
    useState<DonationItem | null>(null);
  const [selectedNeed, setSelectedNeed] =
    useState<ReceiverNeedItem | null>(null);
  const [editingNeed, setEditingNeed] =
    useState<ReceiverNeedItem | null>(null);
  const [prefillDonation, setPrefillDonation] =
    useState<RequestPrefillDonation | null>(null);
  const [matchToConfirm, setMatchToConfirm] =
    useState<ReceiverSmartMatchItem | null>(null);

  // Loading and toast state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setToast({ message, type });
      window.setTimeout(() => setToast(null), 4500);
    },
    []
  );

  
  const loadDashboardData = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setLoading(true);
      setRefreshing(true);

      try {
        const [
          dashRes,
          needsRes,
          donationsRes,
          categoriesRes,
          matchesRes,
        ] = await Promise.allSettled([
          receiverApi.getDashboard(),
          receiverApi.getMyNeeds(),
          receiverApi.getAvailableDonations({ limit: 50 }),
          receiverApi.getCategories("active"),
          receiverApi.getSmartMatches(),
        ]);

        let anyFailed = false;

        if (dashRes.status === "fulfilled" && dashRes.value?.success) {
          setStats(dashRes.value.stats || initialStats);
          setUrgencyDistribution(
            dashRes.value.urgencyDistribution || []
          );
          setCategoryDistribution(
            dashRes.value.categoryDistribution || []
          );
        } else {
          anyFailed = true;
        }

        if (needsRes.status === "fulfilled" && needsRes.value?.success) {
          setMyNeeds(needsRes.value.needs || []);
        } else {
          anyFailed = true;
        }

        if (
          donationsRes.status === "fulfilled" &&
          donationsRes.value?.success
        ) {
          setAvailableDonations(donationsRes.value.donations || []);
        } else {
          anyFailed = true;
        }

        if (
          categoriesRes.status === "fulfilled" &&
          categoriesRes.value?.success
        ) {
          setCategories(categoriesRes.value.categories || []);
        } else {
          anyFailed = true;
        }

        if (
          matchesRes.status === "fulfilled" &&
          matchesRes.value?.success
        ) {
          setSmartMatches(matchesRes.value.matches || []);
        } else {
          anyFailed = true;
        }

        if (anyFailed) {
          showToast(translations[language].loadingError, "error");
        }
      } catch {
        showToast(translations[language].loadingError, "error");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [language, showToast]
  );

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  // Notifications
  const notifications: ReceiverNotification[] = [
    ...availableDonations.slice(0, 2).map((donation) => ({
      id: `avail-${donation._id}`,
      title: text.newDonation,
      message:
        language === "hi"
          ? `"${donation.title}" (${donation.quantity} ${donation.unit}) यहाँ उपलब्ध है: ${
              donation.location?.city || text.nearbyArea
            }`
          : `"${donation.title}" (${donation.quantity} ${donation.unit}) is available in ${
              donation.location?.city || text.nearbyArea
            }`,
      time: text.recent,
      type: "info" as const,
      read: false,
    })),

    ...myNeeds
      .filter((need) =>
        ["matched", "accepted", "in_transit"].includes(need.status)
      )
      .map((need) => ({
        id: `need-${need._id}`,
        title:
          need.status === "in_transit"
            ? text.outForDelivery
            : text.requestMatched,
        message:
          language === "hi"
            ? `आपके अनुरोध "${need.title}" का ${
                need.status === "in_transit"
                  ? text.dispatched
                  : text.matched
              }।`
            : `Your request "${need.title}" has been ${
                need.status === "in_transit"
                  ? text.dispatched
                  : text.matched
              }.`,
        time: text.today,
        type: "success" as const,
        read: false,
      })),
  ];

  const handleNavigateTab = (tab: ReceiverTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleCategoryCreated = (newCategory: CategoryItem) => {
    setCategories((previous) => [newCategory, ...previous]);
    showToast(text.categoryCreated(newCategory.name));
  };

  const handleNeedCreated = () => {
    showToast(text.needSubmitted);
    void loadDashboardData(true);
    setActiveTab("My Requests");
  };

  const handleRequestDonation = (donation: DonationItem) => {
    const categoryName =
      typeof donation.categoryId === "object"
        ? donation.categoryId?.name
        : "";

    const categoryId =
      typeof donation.categoryId === "object"
        ? donation.categoryId?._id
        : donation.categoryId ?? "";

    const matchingOpenNeed = myNeeds.find((need) => {
      const needCategoryId =
        typeof need.categoryId === "object"
          ? need.categoryId?._id
          : need.categoryId;

      return need.status === "open" && needCategoryId === categoryId;
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
          donorName:
            typeof donation.donorId === "object"
              ? donation.donorId?.name
              : text.communityDonor,
          location: donation.location,
          availableUntil: donation.availableUntil,
          foodDetails: donation.foodDetails,
        },
        logistics: {
          recommendedMode:
            matchingOpenNeed.deliveryPreference &&
            matchingOpenNeed.deliveryPreference !== "any"
              ? (matchingOpenNeed.deliveryPreference as any)
              : "volunteer_delivery",
          label: text.recommendedLogistics,
          description: text.matchedExistingRequest,
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

  const userName =
    user?.name || (language === "hi" ? "प्राप्तकर्ता" : "Receiver");

  const openNeedsCount = myNeeds.filter(
    (need) => need.status === "open"
  ).length;

  return (
    <div className="rd" lang={language}>
      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 20px",
            borderRadius: 12,
            background:
              toast.type === "success" ? "#0b5563" : "#991b1b",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            fontSize: 14,
            fontWeight: 500,
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
        <ReceiverHeader
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
          onRaiseNeedClick={() => setActiveTab("Raise Need")}
          onRefresh={() => void loadDashboardData(true)}
          refreshing={refreshing}
          notifications={notifications}
        />

        <main className="rd-main">
          {activeTab === "Overview" && (
            <OverviewTab
              language={language}
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
              onSelectMatch={setMatchToConfirm}
              loading={loading}
            />
          )}

          {activeTab === "Find Donations" && (
            <FindDonationsTab
              donations={availableDonations}
              loading={loading}
              onViewDonation={setSelectedDonation}
              onRequestDonation={handleRequestDonation}
              onRefresh={() => void loadDashboardData(true)}
              language={language}
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
              language={language}
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
              onRefresh={() => void loadDashboardData(true)}
              language={language}
            />
          )}

          {activeTab === "Account" && (
            <AccountTab
              user={user}
              onLogout={logout}
              language={language}
            />
          )}
        </main>
      </div>

      {selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
          onRequestDonation={handleRequestDonation}
        />
      )}

      {selectedNeed && (
        <NeedDetailsModal
          need={selectedNeed}
          onClose={() => setSelectedNeed(null)}
          onEdit={(need) => {
            setSelectedNeed(null);
            setEditingNeed(need);
          }}
          onCancelNeed={async (id) => {
            try {
              await receiverApi.updateNeed(id, { status: "cancelled" });
              showToast(text.needCancelled);
              setSelectedNeed(null);
              void loadDashboardData(true);
            } catch (error: unknown) {
              const message =
                error instanceof Error ? error.message : text.cancelFailed;
              alert(message);
            }
          }}
        />
      )}

      {editingNeed && (
        <EditNeedModal
          need={editingNeed}
          onClose={() => setEditingNeed(null)}
          onSuccess={() => {
            showToast(text.needUpdated);
            void loadDashboardData(true);
          }}
        />
      )}

      {matchToConfirm && (
        <ConfirmMatchModal
          isOpen={Boolean(matchToConfirm)}
          onClose={() => setMatchToConfirm(null)}
          donation={matchToConfirm.donation}
          need={matchToConfirm.need}
          score={matchToConfirm.score}
          initialMode={
            matchToConfirm.logistics?.recommendedMode ||
            "volunteer_delivery"
          }
          currentRole="receiver"
          onConfirmSuccess={(result) => {
            showToast(result.message || text.matchConfirmed);
            void loadDashboardData(true);
          }}
        />
      )}
    </div>
  );
}