import React from "react";
import { Menu, RefreshCw, Plus } from "lucide-react";
import type { Tab } from "./types";

interface AdminHeaderProps {
  activeTab: Tab;
  loading: boolean;
  onRefresh: () => void;
  onOpenSidebar: () => void;
  onOpenDispatch: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  loading,
  onRefresh,
  onOpenSidebar,
  onOpenDispatch
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E6ECE8] bg-white/90 backdrop-blur-md px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-[#71817A] hover:bg-[#F3F6F3] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-[#8A9891] font-semibold">
            Admin
          </span>
          <span className="text-xs text-[#8A9891]">/</span>
          <span className="text-sm font-bold text-[#26332F]">{activeTab}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-[#DDE6DF] px-3 py-1.5 text-xs font-semibold text-[#4F7C68] hover:bg-[#F3F6F3] transition disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>

        {/* Quick Dispatch Button */}
        <button
          onClick={onOpenDispatch}
          className="flex items-center gap-1.5 rounded-lg bg-[#2F5547] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#254439] transition shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Dispatch Aid</span>
        </button>
      </div>
    </header>
  );
};
