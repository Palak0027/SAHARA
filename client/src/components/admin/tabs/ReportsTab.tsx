import React from "react";

interface ReportsTabProps {
  verificationsList: any[];
  pendingVerificationsCount: number;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  verificationsList,
  pendingVerificationsCount
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#26332F]">Platform Impact & Audit Reports</h2>
        <p className="text-xs text-[#71817A]">
          Analytics, community aid distribution volume, and metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5 shadow-xs">
          <span className="text-xs text-[#71817A] font-semibold">Total Aid Volume</span>
          <div className="text-2xl font-bold text-[#2F5547] mt-1">100% Verified</div>
          <p className="text-[11px] text-[#8A9891] mt-1">Zero commercial middle-men</p>
        </div>
        <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5 shadow-xs">
          <span className="text-xs text-[#71817A] font-semibold">Registered NGOs</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{verificationsList.length}</div>
          <p className="text-[11px] text-[#8A9891] mt-1">{pendingVerificationsCount} awaiting verification</p>
        </div>
        <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5 shadow-xs">
          <span className="text-xs text-[#71817A] font-semibold">Fulfillment Speed</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">&lt; 4 Hours</div>
          <p className="text-[11px] text-[#8A9891] mt-1">Average fresh food distribution time</p>
        </div>
      </div>
    </div>
  );
};
