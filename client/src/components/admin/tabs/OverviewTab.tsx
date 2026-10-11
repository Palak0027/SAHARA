import React, { useState, useMemo } from "react";
import {
  Users,
  Package,
  ClipboardList,
  UserCheck,
  HeartHandshake,
  AlertTriangle,
  Filter
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Tab } from "../types";

interface OverviewTabProps {
  stats: any;
  usersList: any[];
  needsList: any[];
  volunteersList: any[];
  tasksList: any[];
  pendingVerificationsCount: number;
  onNavigateTab: (tab: Tab) => void;
  onOpenDispatchForNeed: (need: any) => void;
}

type TimeFilter = "all" | "today" | "week" | "month";

export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  usersList,
  needsList,
  volunteersList,
  tasksList,
  pendingVerificationsCount,
  onNavigateTab,
  onOpenDispatchForNeed
}) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  const filteredNeeds = useMemo(() => {
    if (timeFilter === "all") return needsList;
    const now = new Date();
    return needsList.filter((n) => {
      const created = new Date(n.createdAt);
      if (timeFilter === "today") return now.toDateString() === created.toDateString();
      if (timeFilter === "week") return now.getTime() - created.getTime() < 7 * 86400000;
      if (timeFilter === "month") return now.getTime() - created.getTime() < 30 * 86400000;
      return true;
    });
  }, [needsList, timeFilter]);

  const filters: { key: TimeFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "today", label: "Today" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" }
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="rounded-xl bg-gradient-to-r from-[#2F5547] to-[#407460] px-5 py-3.5 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                SAHARA Mutual Aid Platform
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                Live
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-emerald-200/80 max-w-lg">
              Monitoring community donations, family requests & volunteer logistics.
            </p>
          </div>
          {pendingVerificationsCount > 0 && (
            <button
              onClick={() => onNavigateTab("Verifications")}
              className="rounded-lg bg-amber-400 text-amber-950 font-bold px-3 py-1.5 text-[11px] hover:bg-amber-300 transition shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{pendingVerificationsCount} NGOs Awaiting Review</span>
            </button>
          )}
        </div>
      </div>

      {/* Time Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 rounded-lg border border-[#DDE6DF] bg-white p-1 shadow-xs">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setTimeFilter(f.key)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
                timeFilter === f.key
                  ? "bg-[#2F5547] text-white shadow-sm"
                  : "text-[#5e7168] hover:bg-[#E7F0E9]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#8A9891]">
          <Filter className="h-3 w-3" />
          <span>Showing: <span className="font-semibold text-[#2F5547]">{timeFilter === "all" ? "All Time" : filters.find(f => f.key === timeFilter)?.label}</span></span>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Registered Users"
          value={stats?.users?.total ?? usersList.length}
          subtitle={`${stats?.users?.active ?? 0} active · ${stats?.users?.blocked ?? 0} blocked`}
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Available Donations"
          value={stats?.donations?.available ?? 0}
          subtitle={`${stats?.donations?.completed ?? 0} fulfilled to date`}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Active Community Needs"
          value={stats?.needs?.open ?? 0}
          subtitle={`${stats?.needs?.critical ?? 0} critical priority`}
          icon={ClipboardList}
          color="amber"
        />
        <StatCard
          title="Field Volunteers"
          value={stats?.volunteers?.active ?? volunteersList.length}
          subtitle={`${tasksList.length} assigned tasks`}
          icon={UserCheck}
          color="purple"
        />
      </div>

      {/* Overview Sub-Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Urgent Needs — compact, scrollable, Inter font */}
        <div className="lg:col-span-2 rounded-xl border border-[#DDE6DF] bg-white shadow-xs overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDF1EE]">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-bold text-[#26332F]">Urgent Community Needs</h3>
              {stats?.needs?.critical > 0 && (
                <span className="rounded bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 leading-none">
                  {stats.needs.critical} Critical
                </span>
              )}
            </div>
            <button
              onClick={() => onNavigateTab("Requests")}
              className="text-[11px] font-bold text-[#4F7C68] hover:underline"
            >
              View All ({needsList.length}) →
            </button>
          </div>

          {/* Scrollable list — max 5 visible, then scroll */}
          <div
            className="px-3 py-2 space-y-1.5 overflow-y-auto"
            style={{ maxHeight: filteredNeeds.length > 5 ? "280px" : "auto" }}
          >
            {filteredNeeds.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#94a39b]">
                No requests for this period.
              </div>
            ) : (
              filteredNeeds.map((need) => (
                <div
                  key={need._id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-[#EDF1EE] px-3 py-2.5 hover:border-[#CAD8CE] hover:bg-[#FAFCFB] transition"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide leading-none ${
                          need.urgency === "critical"
                            ? "bg-red-100 text-red-700"
                            : need.urgency === "high"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {need.urgency}
                      </span>
                      <h4 className="text-[12px] font-semibold text-[#26332F] truncate">
                        {need.title}
                      </h4>
                      <span className="shrink-0 text-[10px] text-[#94a39b] hidden sm:inline">
                        {need.quantity} {need.unit}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-[#8A9891]">
                      {need.receiverId?.name || "Community Member"} · {need.location?.city || "Delhi NCR"}
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenDispatchForNeed(need)}
                    className="shrink-0 rounded-md bg-[#2F5547] text-white px-2.5 py-1.5 text-[10px] font-semibold hover:bg-[#254439] transition"
                  >
                    Assign
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#EDF1EE] px-4 py-2">
            <p className="text-[10px] text-[#94a39b]">
              {filteredNeeds.length} request{filteredNeeds.length !== 1 ? "s" : ""} shown
            </p>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Dispatch Active
            </span>
          </div>
        </div>

        {/* Platform Summary — compact */}
        <div className="rounded-xl border border-[#DDE6DF] bg-white shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDF1EE]">
            <h3 className="text-[13px] font-bold text-[#26332F]">Platform Summary</h3>
            <HeartHandshake className="h-4 w-4 text-[#4F7C68]" />
          </div>

          <div className="px-4 py-2">
            <SummaryItem label="Donors Registered" count={stats?.users?.donors ?? 0} dot="#059669" />
            <SummaryItem label="Receivers & Families" count={stats?.users?.receivers ?? 0} dot="#d97706" />
            <SummaryItem label="Volunteers on Duty" count={stats?.users?.volunteers ?? 0} dot="#7c3aed" />
            <SummaryItem label="Donations in Stock" count={stats?.donations?.available ?? 0} dot="#3b82f6" />
            <SummaryItem label="Completed Aid Runs" count={stats?.donations?.completed ?? 0} dot="#22c55e" />
            <SummaryItem label="Pending NGO Reviews" count={pendingVerificationsCount} alert={pendingVerificationsCount > 0} dot="#ef4444" />
          </div>

          <div className="flex items-center justify-between border-t border-[#EDF1EE] px-4 py-2">
            <p className="text-[10px] text-[#94a39b]">
              {pendingVerificationsCount} audit{pendingVerificationsCount !== 1 ? "s" : ""} pending
            </p>
            <button
              onClick={() => onNavigateTab("Reports")}
              className="text-[10px] font-bold text-[#4F7C68] hover:underline"
            >
              Reports →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  color: "emerald" | "blue" | "amber" | "purple";
}) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700"
  };

  return (
    <div className="rounded-2xl border border-[#DDE6DF] bg-white p-4 shadow-xs flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-[#71817A]">{title}</p>
        <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#26332F]">{value}</h3>
        <p className="mt-0.5 text-[11px] text-[#8A9891]">{subtitle}</p>
      </div>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  count,
  alert,
  dot
}: {
  label: string;
  count: number;
  alert?: boolean;
  dot: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[#F5F7F6] last:border-b-0">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: dot }} />
        <span className="text-[11px] text-[#65756D]">{label}</span>
      </div>
      <span
        className={`text-[11px] font-bold ${alert ? "text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full" : "text-[#26332F]"
          }`}
      >
        {count}
      </span>
    </div>
  );
}
