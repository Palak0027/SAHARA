import React from "react";

interface RequestsTabProps {
  filteredNeeds: any[];
  needUrgencyFilter: string;
  setNeedUrgencyFilter: (filter: string) => void;
  onUpdateNeedStatus: (needId: string, status: string) => void;
  onOpenDispatchForNeed: (need: any) => void;
}

export const RequestsTab: React.FC<RequestsTabProps> = ({
  filteredNeeds,
  needUrgencyFilter,
  setNeedUrgencyFilter,
  onUpdateNeedStatus,
  onOpenDispatchForNeed
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#26332F]">Community Requests & Needs</h2>
          <p className="text-xs text-[#71817A]">
            Review food, clothing, and shelter aid requests from verified individuals and NGOs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={needUrgencyFilter}
            onChange={(e) => setNeedUrgencyFilter(e.target.value)}
            className="rounded-xl border border-[#D9E1DB] bg-white px-3 py-2 text-xs font-semibold text-[#26332F] outline-none"
          >
            <option value="all">All Urgency Levels</option>
            <option value="critical">Critical Only 🔴</option>
            <option value="high">High Urgency 🟠</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredNeeds.map((need) => (
          <div
            key={need._id}
            className="rounded-2xl border border-[#DDE6DF] bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    need.urgency === "critical"
                      ? "bg-red-100 text-red-700"
                      : need.urgency === "high"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {need.urgency}
                </span>
                <h4 className="font-bold text-sm text-[#26332F]">{need.title}</h4>
              </div>

              <p className="text-xs text-[#71817A] mt-1">
                Needed: <strong className="text-[#2F5547]">{need.quantity} {need.unit}</strong> · Category: {need.categoryId?.name || "Relief"} · By: {need.receiverId?.name} ({need.receiverId?.organization?.orgName || "Individual"})
              </p>
              <p className="text-xs text-[#8A9891] mt-0.5">
                📍 Delivery: {need.location?.address}, {need.location?.city}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={need.status}
                onChange={(e) => onUpdateNeedStatus(need._id, e.target.value)}
                className="rounded-lg border border-[#D9E1DB] bg-[#F7F9F7] px-2 py-1.5 text-xs font-semibold text-[#26332F] outline-none"
              >
                <option value="open">Open</option>
                <option value="matched">Matched</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                onClick={() => onOpenDispatchForNeed(need)}
                className="rounded-lg bg-[#2F5547] text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-[#254439] transition"
              >
                Assign Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
