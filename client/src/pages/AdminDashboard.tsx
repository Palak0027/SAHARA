import { useEffect, useMemo, useState } from "react";
import type { ReactNode, ElementType } from "react";
import {
  CheckCircle, AlertTriangle, X, LayoutDashboard, Users, ShieldCheck, Package,
  ClipboardList, UserCheck, BarChart3, UserCog, Inbox, LogOut, Menu, RefreshCw,
  Send, Search, Check, XCircle, UserPlus, Clock, Mail
} from "lucide-react";

import logoImg from "../components/image/sahara-logo.jpeg";
import { useAuth } from "../context/AuthContext";
import { adminApi, type AdminStatsResponse, type ContactMessageItem } from "../services/api/admin";
import { MessagesTab } from "../components/admin/tabs/MessagesTab";
import "../styles/AdminDashboard.css";  

type Tab = "Overview" | "Users" | "Verifications" | "Donations" | "Requests" | "Volunteers" | "Reports" | "Messages" | "Account";
type NavItem = { label: Tab; icon: ElementType; badge?: number };

/* ============================================================
   SHARED HELPERS
   ============================================================ */
const initials = (s?: string) => (s || "?").trim().charAt(0).toUpperCase();
const pretty = (s?: string) => (s || "").replace(/_/g, " ");
const idOf = (v: any) => (v && typeof v === "object" ? v._id : v);

const TONES: Record<string, string> = {
  active: "green", verified: "green", delivered: "green", completed: "green", fulfilled: "green", available: "green", approved: "green", donor: "green",
  pending: "amber", open: "amber", medium: "amber", assigned: "amber", ngo: "amber", organization: "amber",
  matched: "blue", in_progress: "blue", picked_up: "blue", accepted: "blue", low: "blue", receiver: "blue",
  rejected: "red", blocked: "red", cancelled: "red", high: "red", critical: "red",
  volunteer: "violet", admin: "violet",
};
const toneOf = (v?: string) => TONES[(v || "").toLowerCase()] || "gray";

function Badge({ label, tone }: { label?: string; tone?: string }) {
  return <span className={`ad-badge ad-badge--${tone || toneOf(label)}`}>{pretty(label) || "unknown"}</span>;
}

function SectionHead({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="ad-section-head">
      <div>
        <h2 className="ad-section-title">{title}</h2>
        {subtitle && <p className="ad-section-sub">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="ad-empty">
      <span className="ad-empty-icon"><Inbox size={22} /></span>
      <p>{text}</p>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="ad-modal-backdrop" onMouseDown={onClose}>
      <div className="ad-modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
        <div className="ad-modal-head">
          <h3 className="ad-modal-title">{title}</h3>
          <button onClick={onClose} className="ad-modal-close" aria-label="Close dialog"><X size={19} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Chips<T extends string>({ options, value, onChange }: { options: readonly T[]; value: string; onChange: (v: T) => void }) {
  return (
    <div className="ad-chips">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={`ad-chip ${value === o ? "is-active" : ""}`}>{pretty(o)}</button>
      ))}
    </div>
  );
}

/* ============================================================
   SIDEBAR
   ============================================================ */
type AdminSidebarProps = {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  user: any;
  logout: () => void;
  nav: NavItem[];
};

function AdminSidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, user, logout, nav }: AdminSidebarProps) {
  const name = user?.name || "Admin";
  const go = (t: Tab) => { setActiveTab(t); setSidebarOpen(false); };

  return (
    <>
      {sidebarOpen && <button className="ad-overlay" aria-label="Close menu overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`ad-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="ad-brand">
          <div className="ad-brand-main">
            <img src={logoImg} alt="SAHARA logo" className="ad-logo" />
            <div>
              <h1 className="ad-brand-name">SAHARA</h1>
              <p className="ad-brand-tag">Admin Portal</p>
            </div>
          </div>
          <button className="ad-icon-btn-dark ad-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="ad-nav" aria-label="Admin">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.label} onClick={() => go(item.label as Tab)} className={`ad-nav-btn ${activeTab === item.label ? "is-active" : ""}`}>
                <Icon size={18} />
                {item.label}
                {item.badge ? <span className="ad-nav-badge">{item.badge}</span> : null}
              </button>
            );
          })}
        </nav>

        <div className="ad-user">
          <div className="ad-avatar">{initials(name)}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p className="ad-user-name">{name}</p>
            <p className="ad-user-role">Administrator</p>
          </div>
          <button onClick={logout} className="ad-icon-btn-dark" title="Log out" aria-label="Log out"><LogOut size={17} /></button>
        </div>
      </aside>
    </>
  );
}

/* ============================================================
   HEADER
   ============================================================ */
const SUBTITLES: Record<string, string> = {
  Overview: " ",
  Users: " ",
  Verifications: "Review organization requests",
  Donations: "Track and dispatch donations",
  Requests: "Needs raised by the community",
  Volunteers: "Your on-ground team",
  Reports: "Numbers that matter",
  Messages: "Contact inquiries from website visitors",
  Account: "Your admin profile",
};

type AdminHeaderProps = { activeTab: Tab; loading: boolean; onRefresh: () => void; onOpenSidebar: () => void; onOpenDispatch: () => void };

function AdminHeader({ activeTab, loading, onRefresh, onOpenSidebar, onOpenDispatch }: AdminHeaderProps) {
  return (
    <header className="ad-header">
      <div className="ad-header-left">
        <button onClick={onOpenSidebar} className="ad-icon-btn ad-menu-btn" aria-label="Open menu"><Menu size={19} /></button>
        <div>
          <p className="ad-kicker">{SUBTITLES[activeTab as string] || "Admin"}</p>
          <h2 className="ad-title">{activeTab}</h2>
        </div>
      </div>
      <div className="ad-header-actions">
        <button onClick={onRefresh} disabled={loading} className={`ad-icon-btn ${loading ? "is-spinning" : ""}`} aria-label="Refresh data" title="Refresh"><RefreshCw size={18} /></button>
        <button onClick={onOpenDispatch} className="ad-btn ad-btn-primary"><Send size={16} />Dispatch task</button>
      </div>
    </header>
  );
}

/* ============================================================
   TAB: Overview
   ============================================================ */
type OverviewTabProps = {
  stats: any;
  usersList: any[];
  needsList: any[];
  volunteersList: any[];
  tasksList: any[];
  pendingVerificationsCount: number;
  onNavigateTab: (t: Tab) => void;
  onOpenDispatchForNeed: (need: any) => void;
};

const pick = (o: any, keys: string[], fallback: number | string) => {
  for (const k of keys) if (typeof o?.[k] === "number") return o[k];
  return fallback;
};
const URGENCY_WEIGHT: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
const CLOSED = ["fulfilled", "completed", "cancelled"];

function OverviewTab({ stats, usersList, needsList, volunteersList, tasksList, pendingVerificationsCount, onNavigateTab, onOpenDispatchForNeed }: OverviewTabProps) {
  const openNeeds = needsList.filter((n) => !CLOSED.includes(n.status));
  const urgent = [...openNeeds].sort((a, b) => (URGENCY_WEIGHT[b.urgency] || 0) - (URGENCY_WEIGHT[a.urgency] || 0)).slice(0, 4);
  const availableVols = volunteersList.filter((v) => v.availability !== false);

  const roleCount = usersList.reduce<Record<string, number>>((acc, u) => {
    const r = u.role || "other";
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {});
  const roles = Object.entries(roleCount).sort((a, b) => b[1] - a[1]);
  const totalUsers = usersList.length || 1;

  const cards = [
    { label: "Total users", value: pick(stats, ["totalUsers", "users"], usersList.length), icon: <Users size={19} />, tone: "" },
    { label: "Donations", value: pick(stats, ["totalDonations", "donations"], "-"), icon: <Package size={19} />, tone: "ad-stat--green" },
    { label: "Open requests", value: openNeeds.length, icon: <ClipboardList size={19} />, tone: "ad-stat--amber" },
    { label: "Volunteers", value: pick(stats, ["totalVolunteers", "volunteers"], volunteersList.length), icon: <UserCheck size={19} />, tone: "ad-stat--violet" },
  ];

  return (
    <>
      <section className="ad-hero ad-hero--split">
        <div>
          <h1 className="ad-hero-title">Everything is moving. Here is what needs you today.</h1>
          <p className="ad-hero-text">
            {pendingVerificationsCount > 0
              ? `${pendingVerificationsCount} organization${pendingVerificationsCount !== 1 ? "s are" : " is"} waiting for verification and ${urgent.length} urgent request${urgent.length !== 1 ? "s" : ""} need volunteers.`
              : `No pending verifications. ${urgent.length} urgent request${urgent.length !== 1 ? "s" : ""} need volunteers.`}
          </p>
        </div>
        <button className="ad-hero-chip" onClick={() => onNavigateTab("Verifications" as Tab)}>
          <ShieldCheck size={22} />
          <span className="ad-hero-chip-num">{pendingVerificationsCount}</span>
          <span className="ad-hero-chip-label">pending verifications</span>
        </button>
      </section>

      <section className="ad-stats">
        {cards.map((c) => (
          <div key={c.label} className={`ad-stat ${c.tone}`}>
            <div className="ad-stat-icon">{c.icon}</div>
            <p className="ad-stat-value">{c.value}</p>
            <p className="ad-stat-label">{c.label}</p>
          </div>
        ))}
      </section>

      <div className="ad-grid-2">
        <section>
          <SectionHead title="Urgent requests" subtitle="Highest priority first" action={<button className="ad-link-btn" onClick={() => onNavigateTab("Requests" as Tab)}>View all</button>} />
          {urgent.length === 0 ? <Empty text="No open requests right now." /> : (
            <div className="ad-list">
              {urgent.map((n) => (
                <div key={n._id} className="ad-row">
                  <div className="ad-cell-user">
                    <span className="ad-cell-avatar">{initials(n.title)}</span>
                    <div>
                      <p className="ad-cell-title">{n.title}</p>
                      <p className="ad-cell-sub">{n.location?.city || "Location not set"}</p>
                    </div>
                  </div>
                  <div className="ad-row-side">
                    <Badge label={n.urgency} />
                    <button className="ad-btn ad-btn-outline ad-btn-sm" onClick={() => onOpenDispatchForNeed(n)}><Send size={14} />Dispatch</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHead title="Who is on the platform" subtitle="Users by role" />
          <div className="ad-card">
            {roles.length === 0 ? <p className="ad-cell-sub">No users loaded yet.</p> : roles.map(([role, count]) => (
              <div key={role} className="ad-bar-row">
                <div className="ad-bar-top"><Badge label={role} /><span className="ad-cell-sub">{count}</span></div>
                <div className="ad-progress"><span style={{ width: `${Math.round((count / totalUsers) * 100)}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="ad-grid-2">
        <section>
          <SectionHead title="Recent tasks" subtitle="Latest volunteer dispatches" action={<button className="ad-link-btn" onClick={() => onNavigateTab("Volunteers" as Tab)}>View all</button>} />
          {tasksList.length === 0 ? <Empty text="No tasks dispatched yet." /> : (
            <div className="ad-list">
              {tasksList.slice(0, 4).map((t) => (
                <div key={t._id} className="ad-row">
                  <div>
                    <p className="ad-cell-title">{t.title}</p>
                    <p className="ad-cell-sub">{t.volunteerId?.name || t.volunteer?.name || "Unassigned"}{t.scheduledTime ? `, ${t.scheduledTime}` : ""}</p>
                  </div>
                  <Badge label={t.status || "pending"} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHead title="Volunteers available" subtitle={`${availableVols.length} of ${volunteersList.length} ready`} />
          {availableVols.length === 0 ? <Empty text="No volunteers available." /> : (
            <div className="ad-list">
              {availableVols.slice(0, 4).map((v) => (
                <div key={idOf(v)} className="ad-row">
                  <div className="ad-cell-user">
                    <span className="ad-cell-avatar">{initials(v.name)}</span>
                    <div>
                      <p className="ad-cell-title">{v.name}</p>
                      <p className="ad-cell-sub">{v.location?.city || v.phone || ""}</p>
                    </div>
                  </div>
                  <Badge label="available" />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

/* ============================================================
   TAB: Users
   ============================================================ */
const ROLES = ["all", "donor", "receiver", "volunteer", "admin"] as const;

type UsersTabProps = {
  filteredUsers: any[];
  userSearch: string;
  setUserSearch: (v: string) => void;
  userRoleFilter: string;
  setUserRoleFilter: (v: string) => void;
  onToggleUserStatus: (userId: string, currentStatus: boolean) => void;
  actionLoading: boolean;
};

function UsersTab({ filteredUsers, userSearch, setUserSearch, userRoleFilter, setUserRoleFilter, onToggleUserStatus, actionLoading }: UsersTabProps) {
  return (
    <section>
      <SectionHead title="Users" subtitle={`${filteredUsers.length} people match your filters`} />
      <div className="ad-toolbar">
        <div className="ad-search ad-search-box">
          <Search size={16} />
          <input className="ad-input" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search by name, phone, email or role" />
        </div>
        <Chips options={ROLES} value={userRoleFilter} onChange={setUserRoleFilter} />
      </div>

      {filteredUsers.length === 0 ? <Empty text="No users found." /> : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead><tr><th>User</th><th>Contact</th><th>Role</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filteredUsers.map((u) => {
                const active = u.isActive !== false;
                return (
                  <tr key={u._id}>
                    <td>
                      <div className="ad-cell-user">
                        <span className="ad-cell-avatar">{initials(u.name)}</span>
                        <div>
                          <p className="ad-cell-title">{u.name || "Unnamed"}</p>
                          <p className="ad-cell-sub">{u.location?.city || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td><p>{u.phone || "-"}</p><p className="ad-cell-sub">{u.email || ""}</p></td>
                    <td><Badge label={u.role} /></td>
                    <td><Badge label={active ? "active" : "blocked"} /></td>
                    <td style={{ textAlign: "right" }}>
                      <button disabled={actionLoading} onClick={() => onToggleUserStatus(u._id, active)} className={`ad-btn ad-btn-sm ${active ? "ad-btn-danger" : "ad-btn-success"}`}>
                        {active ? "Block" : "Activate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   TAB: Verifications
   ============================================================ */
const FILTERS = ["all", "pending", "verified", "rejected"] as const;

type VerificationsTabProps = {
  verificationsList: any[];
  onVerificationDecision: (org: any, status: "verified" | "rejected", reason?: string) => void;
  actionLoading: boolean;
};

function VerificationsTab({ verificationsList, onVerificationDecision, actionLoading }: VerificationsTabProps) {
  const [filter, setFilter] = useState<string>("pending");
  const shown = verificationsList.filter((o) => filter === "all" || o.organization?.verificationStatus === filter);

  const reject = (org: any) => {
    const reason = window.prompt("Reason for rejection (shown to the organization):");
    if (reason === null) return;
    onVerificationDecision(org, "rejected", reason.trim() || undefined);
  };

  return (
    <section>
      <SectionHead title="Verifications" subtitle="Approve genuine organizations, reject the rest." />
      <div className="ad-toolbar"><Chips options={FILTERS} value={filter} onChange={setFilter} /></div>

      {shown.length === 0 ? <Empty text={`No ${filter === "all" ? "" : filter} organizations.`} /> : (
        <div className="ad-cards">
          {shown.map((o) => {
            const org = o.organization || {};
            const name = org.organizationName || org.name || o.name || "Organization";
            const status = org.verificationStatus || "pending";
            return (
              <article key={o._id} className="ad-item">
                <div className="ad-item-head">
                  <div className="ad-cell-user">
                    <span className="ad-cell-avatar">{initials(name)}</span>
                    <div><p className="ad-cell-title">{name}</p><p className="ad-cell-sub">{org.type || org.organizationType || "Organization"}</p></div>
                  </div>
                  <Badge label={status} />
                </div>
                <div className="ad-meta">
                  {o.name && <p>Contact: {o.name}</p>}
                  {o.phone && <p>Phone: {o.phone}</p>}
                  {o.email && <p>Email: {o.email}</p>}
                  {(org.registrationNumber || org.registrationId) && <p>Reg. no: {org.registrationNumber || org.registrationId}</p>}
                  {o.location?.city && <p>City: {o.location.city}</p>}
                </div>
                {status !== "verified" && (
                  <div className="ad-item-actions">
                    <button disabled={actionLoading} onClick={() => onVerificationDecision(o, "verified")} className="ad-btn ad-btn-success ad-btn-sm"><Check size={15} />Approve</button>
                    {status !== "rejected" && <button disabled={actionLoading} onClick={() => reject(o)} className="ad-btn ad-btn-danger ad-btn-sm"><XCircle size={15} />Reject</button>}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ============================================================
   TAB: Donations
   ============================================================ */
// Backend ke donation status ke hisaab se yahan edit kar sakte ho
const DONATION_STATUSES = ["available", "matched", "picked_up", "delivered", "cancelled"] as const;

type DonationsTabProps = {
  filteredDonations: any[];
  donationSearch: string;
  setDonationSearch: (v: string) => void;
  donationStatusFilter: string;
  setDonationStatusFilter: (v: string) => void;
  onUpdateDonationStatus: (id: string, status: string) => void;
  onOpenDispatchForDonation: (d: any) => void;
};

function DonationsTab({ filteredDonations, donationSearch, setDonationSearch, donationStatusFilter, setDonationStatusFilter, onUpdateDonationStatus, onOpenDispatchForDonation }: DonationsTabProps) {
  return (
    <section>
      <SectionHead title="Donations" subtitle={`${filteredDonations.length} donations`} />
      <div className="ad-toolbar">
        <div className="ad-search ad-search-box">
          <Search size={16} />
          <input className="ad-input" value={donationSearch} onChange={(e) => setDonationSearch(e.target.value)} placeholder="Search by title, donor or city" />
        </div>
        <Chips options={["all", ...DONATION_STATUSES] as const} value={donationStatusFilter} onChange={setDonationStatusFilter} />
      </div>

      {filteredDonations.length === 0 ? <Empty text="No donations found." /> : (
        <div className="ad-cards">
          {filteredDonations.map((d) => {
            const options: string[] = DONATION_STATUSES.includes(d.status) ? [...DONATION_STATUSES] : [d.status, ...DONATION_STATUSES];
            return (
              <article key={d._id} className="ad-item">
                <div className="ad-item-head">
                  <div>
                    <p className="ad-cell-title">{d.title}</p>
                    <p className="ad-cell-sub">{d.donorId?.name || "Unknown donor"}</p>
                  </div>
                  <Badge label={d.status} />
                </div>
                <div className="ad-meta">
                  {(d.category || d.type) && <p>Type: {pretty(d.category || d.type)}</p>}
                  {d.quantity && <p>Quantity: {d.quantity}</p>}
                  <p>City: {d.location?.city || "-"}</p>
                </div>
                <div className="ad-item-actions">
                  <select className="ad-select" value={d.status} onChange={(e) => onUpdateDonationStatus(d._id, e.target.value)} aria-label="Change status">
                    {options.map((s: string) => <option key={s} value={s}>{pretty(s)}</option>)}
                  </select>
                  <button onClick={() => onOpenDispatchForDonation(d)} className="ad-btn ad-btn-primary ad-btn-sm"><Send size={14} />Dispatch</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ============================================================
   TAB: Requests
   ============================================================ */
// Backend ke need status ke hisaab se yahan edit kar sakte ho
const NEED_STATUSES = ["open", "matched", "in_progress", "fulfilled", "cancelled"] as const;
const URGENCY = ["all", "low", "medium", "high", "critical"] as const;

type RequestsTabProps = {
  filteredNeeds: any[];
  needUrgencyFilter: string;
  setNeedUrgencyFilter: (v: string) => void;
  onUpdateNeedStatus: (id: string, status: string) => void;
  onOpenDispatchForNeed: (n: any) => void;
};

function RequestsTab({ filteredNeeds, needUrgencyFilter, setNeedUrgencyFilter, onUpdateNeedStatus, onOpenDispatchForNeed }: RequestsTabProps) {
  return (
    <section>
      <SectionHead title="Requests" subtitle={`${filteredNeeds.length} needs raised by the community`} />
      <div className="ad-toolbar"><Chips options={URGENCY} value={needUrgencyFilter} onChange={setNeedUrgencyFilter} /></div>

      {filteredNeeds.length === 0 ? <Empty text="No requests found." /> : (
        <div className="ad-cards">
          {filteredNeeds.map((n) => {
            const options: string[] = NEED_STATUSES.includes(n.status) ? [...NEED_STATUSES] : [n.status, ...NEED_STATUSES];
            return (
              <article key={n._id} className={`ad-item ad-item--${n.urgency === "critical" || n.urgency === "high" ? "hot" : "calm"}`}>
                <div className="ad-item-head">
                  <div>
                    <p className="ad-cell-title">{n.title}</p>
                    <p className="ad-cell-sub">{n.requesterId?.name || n.userId?.name || "Community member"}</p>
                  </div>
                  <Badge label={n.urgency} />
                </div>
                <div className="ad-meta">
                  {(n.category || n.type) && <p>Needs: {pretty(n.category || n.type)}</p>}
                  {n.quantity && <p>Quantity: {n.quantity}</p>}
                  <p>City: {n.location?.city || "-"}</p>
                </div>
                <div className="ad-item-actions">
                  <select className="ad-select" value={n.status} onChange={(e) => onUpdateNeedStatus(n._id, e.target.value)} aria-label="Change status">
                    {options.map((s: string) => <option key={s} value={s}>{pretty(s)}</option>)}
                  </select>
                  <button onClick={() => onOpenDispatchForNeed(n)} className="ad-btn ad-btn-primary ad-btn-sm"><Send size={14} />Fulfil</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ============================================================
   TAB: Volunteers
   ============================================================ */
type VolunteersTabProps = {
  volunteersList: any[];
  tasksList: any[];
  onOpenCreateVolunteer: () => void;
  onOpenDispatchModal: (volunteerId?: string) => void;
};

function VolunteersTab({ volunteersList, tasksList, onOpenCreateVolunteer, onOpenDispatchModal }: VolunteersTabProps) {
  const tasksOf = (v: any) => tasksList.filter((t) => idOf(t.volunteerId || t.volunteer) === v._id);

  return (
    <>
      <section>
        <SectionHead
          title="Volunteers"
          subtitle={`${volunteersList.length} on the team`}
          action={<button onClick={onOpenCreateVolunteer} className="ad-btn ad-btn-primary"><UserPlus size={16} />Onboard volunteer</button>}
        />
        {volunteersList.length === 0 ? <Empty text="No volunteers yet. Onboard your first one." /> : (
          <div className="ad-cards">
            {volunteersList.map((v) => (
              <article key={v._id} className="ad-item">
                <div className="ad-item-head">
                  <div className="ad-cell-user">
                    <span className="ad-cell-avatar">{initials(v.name)}</span>
                    <div><p className="ad-cell-title">{v.name}</p><p className="ad-cell-sub">{v.phone}</p></div>
                  </div>
                  <Badge label={v.availability === false ? "blocked" : "available"} tone={v.availability === false ? "gray" : "green"} />
                </div>
                <div className="ad-meta">
                  <p>City: {v.location?.city || "-"}</p>
                  <p>Vehicle: {pretty(v.vehicleType) || "-"}</p>
                  <p>Tasks assigned: {tasksOf(v).length}</p>
                </div>
                <div className="ad-item-actions">
                  <button onClick={() => onOpenDispatchModal(v._id)} className="ad-btn ad-btn-outline ad-btn-sm"><Send size={14} />Assign task</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHead title="Dispatched tasks" subtitle="Latest first" />
        {tasksList.length === 0 ? <Empty text="No tasks dispatched yet." /> : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Task</th><th>Volunteer</th><th>When</th><th>Urgency</th><th>Status</th></tr></thead>
              <tbody>
                {tasksList.map((t) => (
                  <tr key={t._id}>
                    <td><p className="ad-cell-title">{t.title}</p><p className="ad-cell-sub">{t.description || ""}</p></td>
                    <td>{t.volunteerId?.name || t.volunteer?.name || "Unassigned"}</td>
                    <td>{t.scheduledTime || "-"}</td>
                    <td><Badge label={t.urgency || "medium"} /></td>
                    <td><Badge label={t.status || "pending"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

/* ============================================================
   TAB: Reports
   ============================================================ */
type ReportsTabProps = { verificationsList: any[]; pendingVerificationsCount: number };

function ReportsTab({ verificationsList, pendingVerificationsCount }: ReportsTabProps) {
  const total = verificationsList.length;
  const count = (s: string) => verificationsList.filter((o) => o.organization?.verificationStatus === s).length;
  const verified = count("verified");
  const rejected = count("rejected");
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  const rows = [
    { label: "Verified", n: verified, icon: <ShieldCheck size={19} />, tone: "ad-stat--green" },
    { label: "Pending", n: pendingVerificationsCount, icon: <Clock size={19} />, tone: "ad-stat--amber" },
    { label: "Rejected", n: rejected, icon: <XCircle size={19} />, tone: "ad-stat--red" },
  ];

  return (
    <section>
      <SectionHead title="Reports" subtitle="Organization verification summary" />
      <div className="ad-stats ad-stats--three">
        {rows.map((r) => (
          <div key={r.label} className={`ad-stat ${r.tone}`}>
            <div className="ad-stat-icon">{r.icon}</div>
            <p className="ad-stat-value">{r.n}</p>
            <p className="ad-stat-label">{r.label} ({pct(r.n)}%)</p>
          </div>
        ))}
      </div>

      <div className="ad-card" style={{ marginTop: 16 }}>
        <h3 className="ad-card-title">Verification progress</h3>
        {total === 0 ? <p className="ad-cell-sub">No organizations have applied yet.</p> : (
          <>
            <div className="ad-stack-bar" role="img" aria-label="Verification split">
              <span style={{ width: `${pct(verified)}%`, background: "#2e7d32" }} />
              <span style={{ width: `${pct(pendingVerificationsCount)}%`, background: "#e8a33d" }} />
              <span style={{ width: `${pct(rejected)}%`, background: "#b33a3a" }} />
            </div>
            <p className="ad-cell-sub" style={{ marginTop: 10 }}>{total} organizations in total.</p>
          </>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   TAB: Account
   ============================================================ */
function AccountTab({ user, onLogout }: { user: any; onLogout: () => void }) {
  const fields = [
    { label: "Name", value: user?.name },
    { label: "Phone", value: user?.phone },
    { label: "Email", value: user?.email },
    { label: "City", value: user?.location?.city },
  ];
  return (
    <section className="ad-narrow ad-stack">
      <SectionHead title="Account" subtitle="Your admin profile." />
      <div className="ad-card">
        <div className="ad-profile-head">
          <div className="ad-avatar ad-avatar--lg">{initials(user?.name || "Admin")}</div>
          <div>
            <h3 className="ad-profile-name">{user?.name || "Admin"}</h3>
            <Badge label="admin" />
          </div>
        </div>
        <div className="ad-fields">
          {fields.map((f) => (
            <div key={f.label} className="ad-field">
              <p className="ad-field-label">{f.label}</p>
              <p className="ad-field-value">{f.value || "Not available"}</p>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onLogout} className="ad-btn ad-btn-danger"><LogOut size={16} />Log out</button>
    </section>
  );
}

/* ============================================================
   MODAL: Dispatch task
   ============================================================ */
type DispatchTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  form: any;
  setForm: (f: any) => void;
  volunteersList: any[];
  donationsList: any[];
  needsList: any[];
  actionLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

function DispatchTaskModal({ isOpen, onClose, form, setForm, volunteersList, donationsList, needsList, actionLoading, onSubmit }: DispatchTaskModalProps) {
  if (!isOpen) return null;
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <Modal title="Dispatch volunteer task" onClose={onClose}>
      <form onSubmit={onSubmit} className="ad-form">
        <div className="is-full">
          <label className="ad-label" htmlFor="dt-title">Task title</label>
          <input id="dt-title" className="ad-input" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Collect and distribute groceries" required />
        </div>
        <div className="is-full">
          <label className="ad-label" htmlFor="dt-desc">Description</label>
          <textarea id="dt-desc" className="ad-textarea" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Pickup point, drop point, special instructions..." />
        </div>
        <div>
          <label className="ad-label" htmlFor="dt-vol">Volunteer</label>
          <select id="dt-vol" className="ad-select ad-select--full" value={form.volunteerId} onChange={(e) => set("volunteerId", e.target.value)}>
            <option value="">Unassigned</option>
            {volunteersList.map((v) => <option key={v._id} value={v._id}>{v.name}{v.availability === false ? " (busy)" : ""}</option>)}
          </select>
        </div>
        <div>
          <label className="ad-label" htmlFor="dt-time">Scheduled time</label>
          <input id="dt-time" className="ad-input" value={form.scheduledTime} onChange={(e) => set("scheduledTime", e.target.value)} />
        </div>
        <div>
          <label className="ad-label" htmlFor="dt-don">Linked donation</label>
          <select id="dt-don" className="ad-select ad-select--full" value={form.donationId} onChange={(e) => set("donationId", e.target.value)}>
            <option value="">None</option>
            {donationsList.map((d) => <option key={d._id} value={d._id}>{d.title}</option>)}
          </select>
        </div>
        <div>
          <label className="ad-label" htmlFor="dt-need">Linked request</label>
          <select id="dt-need" className="ad-select ad-select--full" value={form.needId} onChange={(e) => set("needId", e.target.value)}>
            <option value="">None</option>
            {needsList.map((n) => <option key={n._id} value={n._id}>{n.title}</option>)}
          </select>
        </div>
        <div>
          <label className="ad-label" htmlFor="dt-urg">Urgency</label>
          <select id="dt-urg" className="ad-select ad-select--full" value={form.urgency} onChange={(e) => set("urgency", e.target.value)}>
            {["low", "medium", "high", "critical"].map((u) => <option key={u} value={u}>{pretty(u)}</option>)}
          </select>
        </div>
        <div>
          <label className="ad-label" htmlFor="dt-ppl">People needed</label>
          <input id="dt-ppl" type="number" min={1} className="ad-input" value={form.peopleNeeded} onChange={(e) => set("peopleNeeded", e.target.value)} />
        </div>
        <div className="ad-actions is-full">
          <button type="button" onClick={onClose} className="ad-btn ad-btn-outline">Cancel</button>
          <button disabled={actionLoading} className="ad-btn ad-btn-primary"><Send size={16} />{actionLoading ? "Dispatching..." : "Dispatch"}</button>
        </div>
      </form>
    </Modal>
  );
}

/* ============================================================
   MODAL: Create volunteer
   ============================================================ */
// Backend ke vehicleType enum ke hisaab se yahan edit kar sakte ho
const VEHICLES = ["two_wheeler", "four_wheeler", "bicycle", "on_foot"];

type CreateVolunteerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  form: any;
  setForm: (f: any) => void;
  modalError: string | null;
  actionLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

function CreateVolunteerModal({ isOpen, onClose, form, setForm, modalError, actionLoading, onSubmit }: CreateVolunteerModalProps) {
  if (!isOpen) return null;
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <Modal title="Onboard new volunteer" onClose={onClose}>
      <form onSubmit={onSubmit} className="ad-form">
        {modalError && <div className="ad-form-error is-full" role="alert">{modalError}</div>}
        <div>
          <label className="ad-label" htmlFor="cv-name">Full name *</label>
          <input id="cv-name" className="ad-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Volunteer name" required />
        </div>
        <div>
          <label className="ad-label" htmlFor="cv-phone">Phone *</label>
          <input id="cv-phone" className="ad-input" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="10-digit phone number" required />
        </div>
        <div>
          <label className="ad-label" htmlFor="cv-email">Email</label>
          <input id="cv-email" type="email" className="ad-input" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Optional" />
        </div>
        <div>
          <label className="ad-label" htmlFor="cv-pass">Password *</label>
          <input id="cv-pass" type="password" className="ad-input" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Temporary password" required />
        </div>
        <div>
          <label className="ad-label" htmlFor="cv-city">City</label>
          <input id="cv-city" className="ad-input" value={form.city} onChange={(e) => set("city", e.target.value)} />
        </div>
        <div>
          <label className="ad-label" htmlFor="cv-veh">Vehicle</label>
          <select id="cv-veh" className="ad-select ad-select--full" value={form.vehicleType} onChange={(e) => set("vehicleType", e.target.value)}>
            {VEHICLES.map((v) => <option key={v} value={v}>{pretty(v)}</option>)}
          </select>
        </div>
        <div className="is-full">
          <label className="ad-label" htmlFor="cv-addr">Address / Area</label>
          <input id="cv-addr" className="ad-input" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="House no, street, area" />
        </div>
        <label className="ad-check is-full">
          <input type="checkbox" checked={!!form.availability} onChange={(e) => set("availability", e.target.checked)} />
          Available for tasks right away
        </label>
        <div className="ad-actions is-full">
          <button type="button" onClick={onClose} className="ad-btn ad-btn-outline">Cancel</button>
          <button disabled={actionLoading} className="ad-btn ad-btn-primary"><UserPlus size={16} />{actionLoading ? "Creating..." : "Create volunteer"}</button>
        </div>
      </form>
    </Modal>
  );
}

/* ============================================================
   MAIN: AdminDashboard (data loading, actions, layout)
   ============================================================ */
export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Live Backend Data States
  const [stats, setStats] = useState<AdminStatsResponse["stats"] | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [verificationsList, setVerificationsList] = useState<any[]>([]);
  const [donationsList, setDonationsList] = useState<any[]>([]);
  const [needsList, setNeedsList] = useState<any[]>([]);
  const [volunteersList, setVolunteersList] = useState<any[]>([]);
  const [tasksList, setTasksList] = useState<any[]>([]);
  const [messagesList, setMessagesList] = useState<ContactMessageItem[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);

  // Search & Filter States
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [donationSearch, setDonationSearch] = useState("");
  const [donationStatusFilter, setDonationStatusFilter] = useState("all");
  const [needUrgencyFilter, setNeedUrgencyFilter] = useState("all");

  // Modals
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showCreateVolunteerModal, setShowCreateVolunteerModal] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const emptyVolunteerForm = {
    name: "",
    phone: "",
    email: "",
    password: "",
    city: "New Delhi",
    address: "",
    vehicleType: "two_wheeler",
    availability: true
  };
  const emptyDispatchForm = {
    title: "",
    description: "",
    volunteerId: "",
    donationId: "",
    needId: "",
    scheduledTime: "Today · 4:00 PM",
    urgency: "medium",
    peopleNeeded: 1
  };

  const [volunteerForm, setVolunteerForm] = useState(emptyVolunteerForm);
  const [dispatchForm, setDispatchForm] = useState(emptyDispatchForm);

  const showAlert = (type: "success" | "error", text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => {
      setAlertMessage(null);
    }, 4500);
  };

  // Fetch all live dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, verifRes, donRes, needsRes, volRes, tasksRes, msgRes] =
        await Promise.all([
          adminApi.getStats().catch(() => null),
          adminApi.getUsers({ limit: 50 }).catch(() => null),
          adminApi.getVerifications({ status: "all" }).catch(() => null),
          adminApi.getDonations({ limit: 50 }).catch(() => null),
          adminApi.getNeeds({ limit: 50 }).catch(() => null),
          adminApi.getVolunteers().catch(() => null),
          adminApi.getTasks({ limit: 50 }).catch(() => null),
          adminApi.getContactMessages({ limit: 100 }).catch(() => null)
        ]);

      if (statsRes?.success) setStats(statsRes.stats);
      if (usersRes?.success) setUsersList(usersRes.users);
      if (verifRes?.success) setVerificationsList(verifRes.organizations);
      if (donRes?.success) setDonationsList(donRes.donations);
      if (needsRes?.success) setNeedsList(needsRes.needs);
      if (volRes?.success) setVolunteersList(volRes.volunteers);
      if (tasksRes?.success) setTasksList(tasksRes.tasks);
      if (msgRes?.success) {
        setMessagesList(msgRes.messages);
        setUnreadMessagesCount(msgRes.unreadCount || 0);
      }
    } catch (err: any) {
      showAlert("error", err?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const refreshStats = () => adminApi.getStats().then((s) => s?.success && setStats(s.stats));

  // Pending Verifications Count
  const pendingVerificationsCount = useMemo(() => {
    return verificationsList.filter(
      (org) => org.organization?.verificationStatus === "pending"
    ).length;
  }, [verificationsList]);

  // Sidebar navigation items
  const nav: NavItem[] = useMemo(
    () => [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Users", icon: Users },
      {
        label: "Verifications",
        icon: ShieldCheck,
        badge: pendingVerificationsCount > 0 ? pendingVerificationsCount : undefined
      },
      { label: "Donations", icon: Package },
      { label: "Requests", icon: ClipboardList },
      { label: "Volunteers", icon: UserCheck },
      { label: "Reports", icon: BarChart3 },
      {
        label: "Messages",
        icon: Mail,
        badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
      },
      { label: "Account", icon: UserCog }
    ],
    [pendingVerificationsCount, unreadMessagesCount]
  );

  // User status toggle (Block / Activate)
  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setActionLoading(true);
    try {
      const res = await adminApi.toggleUserStatus(userId, !currentStatus);
      if (res.success) {
        showAlert("success", res.message || "User status updated successfully");
        setUsersList((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: !currentStatus } : u))
        );
        refreshStats();
      }
    } catch (err: any) {
      showAlert("error", err?.response?.data?.message || "Failed to update user status");
    } finally {
      setActionLoading(false);
    }
  };

  // NGO Verification (Approve / Reject)
  const handleVerificationDecision = async (
    org: any,
    status: "verified" | "rejected",
    reason?: string
  ) => {
    setActionLoading(true);
    try {
      const res = await adminApi.updateVerification(org._id, {
        status,
        rejectionReason: reason
      });
      if (res.success) {
        showAlert("success", `Organization marked as ${status.toUpperCase()}`);
        setVerificationsList((prev) =>
          prev.map((item) =>
            item._id === org._id
              ? { ...item, organization: { ...item.organization, verificationStatus: status } }
              : item
          )
        );
        refreshStats();
      }
    } catch (err: any) {
      showAlert("error", err?.response?.data?.message || "Verification update failed");
    } finally {
      setActionLoading(false);
    }
  };

  // Donation Status Update
  const handleUpdateDonationStatus = async (donationId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await adminApi.updateDonationStatus(donationId, newStatus);
      if (res.success) {
        showAlert("success", "Donation status updated");
        setDonationsList((prev) =>
          prev.map((d) => (d._id === donationId ? { ...d, status: newStatus } : d))
        );
        refreshStats();
      }
    } catch (err: any) {
      showAlert("error", err?.response?.data?.message || "Failed to update donation");
    } finally {
      setActionLoading(false);
    }
  };

  // Need Status Update
  const handleUpdateNeedStatus = async (needId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await adminApi.updateNeedStatus(needId, newStatus);
      if (res.success) {
        showAlert("success", "Need status updated");
        setNeedsList((prev) =>
          prev.map((n) => (n._id === needId ? { ...n, status: newStatus } : n))
        );
        refreshStats();
      }
    } catch (err: any) {
      showAlert("error", err?.response?.data?.message || "Failed to update need");
    } finally {
      setActionLoading(false);
    }
  };

  // Create Volunteer Dispatch Task
  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchForm.title.trim()) {
      showAlert("error", "Task title is required");
      return;
    }
    setActionLoading(true);
    try {
      const res = await adminApi.dispatchTask({
        title: dispatchForm.title,
        description: dispatchForm.description,
        volunteerId: dispatchForm.volunteerId || undefined,
        donationId: dispatchForm.donationId || undefined,
        needId: dispatchForm.needId || undefined,
        scheduledTime: dispatchForm.scheduledTime,
        urgency: dispatchForm.urgency,
        peopleNeeded: Number(dispatchForm.peopleNeeded)
      });
      if (res.success) {
        showAlert("success", "Volunteer Task dispatched successfully!");
        setShowDispatchModal(false);
        setDispatchForm(emptyDispatchForm);
        loadDashboardData();
      }
    } catch (err: any) {
      showAlert("error", err?.response?.data?.message || "Failed to dispatch task");
    } finally {
      setActionLoading(false);
    }
  };

  // Create New Volunteer
  const handleCreateVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !volunteerForm.name.trim() ||
      !volunteerForm.phone.trim() ||
      !volunteerForm.password.trim()
    ) {
      showAlert("error", "Name, phone, and password are required");
      return;
    }
    setModalError(null);
    setActionLoading(true);
    try {
      const res = await adminApi.createVolunteer({
        name: volunteerForm.name,
        phone: volunteerForm.phone,
        email: volunteerForm.email || undefined,
        password: volunteerForm.password,
        location: {
          city: volunteerForm.city,
          address: volunteerForm.address
        },
        vehicleType: volunteerForm.vehicleType,
        availability: volunteerForm.availability
      });
      if (res.success) {
        showAlert("success", res.message || "Volunteer onboarded successfully!");
        setShowCreateVolunteerModal(false);
        setModalError(null);
        setVolunteerForm(emptyVolunteerForm);
        loadDashboardData();
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to create volunteer";
      setModalError(errMsg);
      showAlert("error", errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((item) => {
      const query = userSearch.toLowerCase();
      const matchesSearch =
        item.name?.toLowerCase().includes(query) ||
        item.phone?.includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.role?.toLowerCase().includes(query);

      const matchesRole = userRoleFilter === "all" || item.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [usersList, userSearch, userRoleFilter]);

  // Filtered Donations
  const filteredDonations = useMemo(() => {
    return donationsList.filter((item) => {
      const query = donationSearch.toLowerCase();
      const matchesSearch =
        item.title?.toLowerCase().includes(query) ||
        item.donorId?.name?.toLowerCase().includes(query) ||
        item.location?.city?.toLowerCase().includes(query);

      const matchesStatus =
        donationStatusFilter === "all" || item.status === donationStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [donationsList, donationSearch, donationStatusFilter]);

  // Filtered Needs
  const filteredNeeds = useMemo(() => {
    return needsList.filter((item) => {
      if (needUrgencyFilter === "all") return true;
      return item.urgency === needUrgencyFilter;
    });
  }, [needsList, needUrgencyFilter]);

  return (
    <div className="ad">
      {/* Toast */}
      {alertMessage && (
        <div className={`ad-toast ad-toast--${alertMessage.type}`} role="status">
          {alertMessage.type === "success" ? (
            <CheckCircle className="ad-toast-icon" size={20} />
          ) : (
            <AlertTriangle className="ad-toast-icon" size={20} />
          )}
          <span>{alertMessage.text}</span>
          <button onClick={() => setAlertMessage(null)} className="ad-toast-close" aria-label="Close">
            <X size={16} />
          </button>
        </div>
      )}

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        logout={logout}
        nav={nav}
      />

      <div className="ad-shell">
        <AdminHeader
          activeTab={activeTab}
          loading={loading}
          onRefresh={loadDashboardData}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenDispatch={() => setShowDispatchModal(true)}
        />

        <main className="ad-main">
          {activeTab === "Overview" && (
            <OverviewTab
              stats={stats}
              usersList={usersList}
              needsList={needsList}
              volunteersList={volunteersList}
              tasksList={tasksList}
              pendingVerificationsCount={pendingVerificationsCount}
              onNavigateTab={setActiveTab}
              onOpenDispatchForNeed={(need) => {
                setDispatchForm((prev) => ({
                  ...prev,
                  needId: need._id,
                  title: `Dispatch for: ${need.title}`
                }));
                setShowDispatchModal(true);
              }}
            />
          )}

          {activeTab === "Users" && (
            <UsersTab
              filteredUsers={filteredUsers}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              userRoleFilter={userRoleFilter}
              setUserRoleFilter={setUserRoleFilter}
              onToggleUserStatus={handleToggleUserStatus}
              actionLoading={actionLoading}
            />
          )}

          {activeTab === "Verifications" && (
            <VerificationsTab
              verificationsList={verificationsList}
              onVerificationDecision={handleVerificationDecision}
              actionLoading={actionLoading}
            />
          )}

          {activeTab === "Donations" && (
            <DonationsTab
              filteredDonations={filteredDonations}
              donationSearch={donationSearch}
              setDonationSearch={setDonationSearch}
              donationStatusFilter={donationStatusFilter}
              setDonationStatusFilter={setDonationStatusFilter}
              onUpdateDonationStatus={handleUpdateDonationStatus}
              onOpenDispatchForDonation={(donation) => {
                setDispatchForm((prev) => ({
                  ...prev,
                  donationId: donation._id,
                  title: `Collect & Distribute: ${donation.title}`
                }));
                setShowDispatchModal(true);
              }}
            />
          )}

          {activeTab === "Requests" && (
            <RequestsTab
              filteredNeeds={filteredNeeds}
              needUrgencyFilter={needUrgencyFilter}
              setNeedUrgencyFilter={setNeedUrgencyFilter}
              onUpdateNeedStatus={handleUpdateNeedStatus}
              onOpenDispatchForNeed={(need) => {
                setDispatchForm((prev) => ({
                  ...prev,
                  needId: need._id,
                  title: `Fulfill Need: ${need.title}`
                }));
                setShowDispatchModal(true);
              }}
            />
          )}

          {activeTab === "Volunteers" && (
            <VolunteersTab
              volunteersList={volunteersList}
              tasksList={tasksList}
              onOpenCreateVolunteer={() => {
                setModalError(null);
                setShowCreateVolunteerModal(true);
              }}
              onOpenDispatchModal={(volunteerId) => {
                if (volunteerId) {
                  setDispatchForm((prev) => ({ ...prev, volunteerId }));
                }
                setShowDispatchModal(true);
              }}
            />
          )}

          {activeTab === "Reports" && (
            <ReportsTab
              verificationsList={verificationsList}
              pendingVerificationsCount={pendingVerificationsCount}
            />
          )}

          {activeTab === "Messages" && (
            <MessagesTab
              messagesList={messagesList}
              onUpdateStatus={async (id, status) => {
                setActionLoading(true);
                try {
                  const res = await adminApi.updateContactStatus(id, { status });
                  if (res.success) {
                    setMessagesList((prev) =>
                      prev.map((m) => (m._id === id ? { ...m, status } : m))
                    );
                    setUnreadMessagesCount((prev) => {
                      const updated = messagesList.map((m) => (m._id === id ? { ...m, status } : m));
                      return updated.filter((m) => m.status === "unread").length;
                    });
                    showAlert("success", "Message status updated");
                  }
                } catch (err: any) {
                  showAlert("error", err?.message || "Failed to update status");
                } finally {
                  setActionLoading(false);
                }
              }}
              onDeleteMessage={async (id) => {
                setActionLoading(true);
                try {
                  const res = await adminApi.deleteContactMessage(id);
                  if (res.success) {
                    setMessagesList((prev) => prev.filter((m) => m._id !== id));
                    setUnreadMessagesCount((prev) => {
                      const updated = messagesList.filter((m) => m._id !== id);
                      return updated.filter((m) => m.status === "unread").length;
                    });
                    showAlert("success", "Message deleted successfully");
                  }
                } catch (err: any) {
                  showAlert("error", err?.message || "Failed to delete message");
                } finally {
                  setActionLoading(false);
                }
              }}
              actionLoading={actionLoading}
            />
          )}

          {activeTab === "Account" && <AccountTab user={user} onLogout={logout} />}
        </main>
      </div>

      <DispatchTaskModal
        isOpen={showDispatchModal}
        onClose={() => setShowDispatchModal(false)}
        form={dispatchForm}
        setForm={setDispatchForm}
        volunteersList={volunteersList}
        donationsList={donationsList}
        needsList={needsList}
        actionLoading={actionLoading}
        onSubmit={handleDispatchSubmit}
      />

      <CreateVolunteerModal
        isOpen={showCreateVolunteerModal}
        onClose={() => setShowCreateVolunteerModal(false)}
        form={volunteerForm}
        setForm={setVolunteerForm}
        modalError={modalError}
        actionLoading={actionLoading}
        onSubmit={handleCreateVolunteerSubmit}
      />
    </div>
  );
}