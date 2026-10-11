import React from "react";
import { ShieldCheck, Building2, CheckCircle } from "lucide-react";

interface VerificationsTabProps {
  verificationsList: any[];
  onVerificationDecision: (org: any, status: "verified" | "rejected", reason?: string) => void;
  actionLoading: boolean;
}

export const VerificationsTab: React.FC<VerificationsTabProps> = ({
  verificationsList,
  onVerificationDecision,
  actionLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#26332F]">
            NGO & Community Verifications
          </h2>
          <p className="text-xs text-[#71817A]">
            Review organizational licenses, government registration numbers, and verify authenticity.
          </p>
        </div>
      </div>

      {verificationsList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#CAD8CE] p-10 text-center bg-white">
          <ShieldCheck className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-[#26332F]">No pending verifications</h3>
          <p className="text-xs text-[#8A9891] mt-1">
            All registered NGOs and organizations are currently verified.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verificationsList.map((org) => {
            const status = org.organization?.verificationStatus || "pending";
            return (
              <div
                key={org._id}
                className="rounded-2xl border border-[#DDE6DF] bg-white p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#26332F]">
                        {org.organization?.orgName || org.name}
                      </h4>
                      <p className="text-xs text-[#71817A]">
                        Rep: {org.name} · {org.phone}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${
                      status === "verified"
                        ? "bg-emerald-100 text-emerald-800"
                        : status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="rounded-xl bg-[#F8FAF8] p-3 text-xs space-y-1.5">
                  <div>
                    <span className="font-semibold text-[#26332F]">Registration No: </span>
                    <span className="font-mono text-[#3E6856]">
                      {org.organization?.regNumber || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#26332F]">Address: </span>
                    <span className="text-[#65756D]">
                      {org.location?.address}, {org.location?.city}
                    </span>
                  </div>
                  {org.organization?.description && (
                    <div>
                      <span className="font-semibold text-[#26332F]">Mission: </span>
                      <span className="text-[#65756D]">{org.organization.description}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {status !== "verified" && (
                    <button
                      onClick={() => onVerificationDecision(org, "verified")}
                      disabled={actionLoading}
                      className="flex-1 rounded-xl bg-[#2F5547] text-white py-2 text-xs font-semibold hover:bg-[#254439] transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve & Verify</span>
                    </button>
                  )}
                  {status !== "rejected" && (
                    <button
                      onClick={() => {
                        const reason = prompt("Enter rejection reason:");
                        if (reason) {
                          onVerificationDecision(org, "rejected", reason);
                        }
                      }}
                      disabled={actionLoading}
                      className="rounded-xl border border-red-200 bg-red-50 text-red-600 px-4 py-2 text-xs font-semibold hover:bg-red-100 transition"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
