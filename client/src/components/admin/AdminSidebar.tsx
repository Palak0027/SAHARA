import React from "react";
import { ShieldCheck, X, LogOut } from "lucide-react";
import type { NavItem, Tab } from "./types";

interface AdminSidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: any;
  logout: () => void;
  nav: NavItem[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  user,
  logout,
  nav
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-[#DDE6DF] bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between border-b border-[#E6ECE8] px-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2F5547] text-white font-bold text-sm">
                S
              </span>
              <h1 className="text-xl font-bold tracking-tight text-[#2F5547]">
                SAHARA
              </h1>
            </div>
            <p className="mt-0.5 text-[11px] text-[#8A9891] tracking-wide uppercase font-medium">
              Admin Command Center
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-[#71817A] hover:bg-[#F3F6F3] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin Profile Chip */}
        <div className="shrink-0 border-b border-[#E6ECE8] px-3 py-3">
          <div className="flex items-center gap-3 rounded-xl bg-[#F3F7F4] p-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DDEBE2] text-[#3E6856]">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[#26332F]">
                {user?.name || "Super Admin"}
              </p>
              <p className="text-[11px] text-[#71817A] truncate">
                {user?.email || "admin@sahara.org"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.label;

            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTab(item.label);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                  active
                    ? "bg-[#E7F0E9] text-[#2F5547] shadow-xs"
                    : "text-[#65756D] hover:bg-[#F4F7F5] hover:text-[#2F5547]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${active ? "text-[#2F5547]" : "text-[#71817A]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[11px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-[#E6ECE8] p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
