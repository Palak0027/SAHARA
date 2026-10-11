import React from "react";
import { ShieldCheck } from "lucide-react";

interface AccountTabProps {
  user: any;
  onLogout: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({ user, onLogout }) => {
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-bold text-[#26332F]">Administrator Settings</h2>
      <div className="rounded-2xl border border-[#DDE6DF] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDEBE2] text-[#2F5547]">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#26332F]">{user?.name}</h3>
            <p className="text-xs text-[#71817A]">{user?.email}</p>
            <span className="inline-block mt-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
              Root Super Admin
            </span>
          </div>
        </div>

        <div className="border-t border-[#E6ECE8] pt-4 space-y-2 text-xs">
          <p>
            <strong>Phone:</strong> {user?.phone}
          </p>
          <p>
            <strong>Permissions:</strong> Full Database Access & Dispatch Authority
          </p>
          <p>
            <strong>Environment:</strong> Production Cloud Atlas
          </p>
        </div>

        <div className="border-t border-[#E6ECE8] pt-4">
          <button
            onClick={onLogout}
            className="w-full rounded-xl bg-red-600 text-white py-2.5 text-xs font-bold hover:bg-red-700 transition"
          >
            Logout Admin Session
          </button>
        </div>
      </div>
    </div>
  );
};
