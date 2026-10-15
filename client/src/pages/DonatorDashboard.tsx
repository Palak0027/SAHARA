import logoImg from '../components/image/sahara-logo.jpeg';
import { useState } from "react";
import {
  Bell, Gift, Heart, Home, Package, Plus, Utensils, Shirt, Clock, CheckCircle2,
  Menu, X, LogOut, Users, Eye, Check, XCircle, Settings, Inbox,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/DonatorDashboard.css";

type DonationStatus = "Active" | "Completed";
type RequestStatus = "Pending" | "Approved" | "Completed" | "Rejected";
type Tab = "Overview" | "Post Donation" | "My Donations" | "Requests" | "Account";
type DonationFilter = "All" | DonationStatus;

const BASE_TYPES = ["Food", "Clothes"];
const NEW_TYPE = "__new__";

const normalizeType = (raw: string, known: string[]) => {
  const clean = raw.trim().replace(/\s+/g, " ");
  if (!clean) return "";
  const match = known.find((t) => t.toLowerCase() === clean.toLowerCase());
  return match ?? clean.charAt(0).toUpperCase() + clean.slice(1);
};

const typeMeta = (type: string) => {
  if (type === "Food") return { Icon: Utensils, tone: "", btn: "Food" };
  if (type === "Clothes") return { Icon: Shirt, tone: "sd-donation--clothes", btn: "Clothes" };
  return { Icon: Gift, tone: "sd-donation--other", btn: "other" };
};

type Donation = {
  id: number;
  type: string;  
  title: string;
  description: string;
  quantity: string;
  requests: number;
  status: DonationStatus;
};

type DonationRequest = {
  id: number;
  item: string;
  receiver: string;
  status: RequestStatus;
  date: string;
};

export default function DonatorDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [showNotifications, setShowNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);
  const [filter, setFilter] = useState<DonationFilter>("All");

  const [donations, setDonations] = useState<Donation[]>([
    { id: 1, type: "Food", title: "Grocery Essentials", description: "Rice, flour, sugar and other grocery items available for donation.", quantity: "5 items", requests: 2, status: "Active" },
    { id: 2, type: "Clothes", title: "Winter Clothes", description: "Clean and gently-used winter clothes for adults and children.", quantity: "8 items", requests: 3, status: "Active" },
    { id: 3, type: "Food", title: "Packed Meals", description: "Freshly prepared meals available for nearby families.", quantity: "10 meals", requests: 1, status: "Completed" },
  ]);

  const [requests, setRequests] = useState<DonationRequest[]>([
    { id: 1, item: "Grocery Essentials", receiver: "Nearby Family", status: "Pending", date: "Today" },
    { id: 2, item: "Winter Clothes", receiver: "Local Resident", status: "Approved", date: "Yesterday" },
    { id: 3, item: "Packed Meals", receiver: "Community Member", status: "Completed", date: "24 Sep 2026" },
  ]);

  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [form, setForm] = useState({ type: "Food", customType: "", title: "", description: "", quantity: "" });
  const userName = user?.name || "User";
  const firstName = userName.split(" ")[0];
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;
  const completedDonations = donations.filter((d) => d.status === "Completed").length;
  const totalPeopleReached = donations.reduce((sum, d) => sum + d.requests, 0);
  const visibleDonations = filter === "All" ? donations : donations.filter((d) => d.status === filter);

  const navigateTab = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    setShowNotifications(false);
  };

  const handlePostDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const knownTypes = [...BASE_TYPES, ...customTypes];
    const typeName = form.type === NEW_TYPE ? normalizeType(form.customType, knownTypes) : form.type;
    if (!typeName || !form.title.trim() || !form.description.trim() || !form.quantity.trim()) return;

    if (!knownTypes.includes(typeName)) setCustomTypes((prev) => [...prev, typeName]);

    setDonations((prev) => [
      { id: Date.now(), type: typeName, title: form.title, description: form.description, quantity: form.quantity, requests: 0, status: "Active" },
      ...prev,
    ]);
    setForm({ type: "Food", customType: "", title: "", description: "", quantity: "" });
    navigateTab("My Donations");
  };

  const updateRequest = (id: number, status: "Approved" | "Rejected") => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelectedRequest(null);
  };

  const navigation: { name: Tab; icon: React.ReactNode }[] = [
    { name: "Overview", icon: <Home size={18} /> },
    { name: "Post Donation", icon: <Plus size={18} /> },
    { name: "My Donations", icon: <Package size={18} /> },
    { name: "Requests", icon: <Users size={18} /> },
    { name: "Account", icon: <Settings size={18} /> },
  ];

  const stats = [
    { label: "Total donations", value: donations.length, icon: <Package size={19} />, tone: "" },
    { label: "People reached", value: totalPeopleReached, icon: <Users size={19} />, tone: "sd-stat--people" },
    { label: "Completed donations", value: completedDonations, icon: <CheckCircle2 size={19} />, tone: "sd-stat--done" },
    { label: "Pending requests", value: pendingRequests, icon: <Clock size={19} />, tone: "sd-stat--pending" },
  ];

  return (
    <div className="sd">
      {sidebarOpen && <button aria-label="Close menu overlay" onClick={() => setSidebarOpen(false)} className="sd-overlay" />}

      <aside className={`sd-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="sd-brand">
          <div className="sd-brand-main">
            <img src={logoImg} alt="SAHARA logo" className="sd-logo" />
            <div>
              <h1 className="sd-brand-name">SAHARA</h1>
              <p className="sd-brand-tag">Community Care</p>
            </div>
          </div>
          <button className="sd-close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="sd-nav" aria-label="Dashboard">
          {navigation.map((item) => (
            <button key={item.name} onClick={() => navigateTab(item.name)} className={`sd-nav-btn ${activeTab === item.name ? "is-active" : ""}`}>
              {item.icon}
              {item.name}
              {item.name === "Requests" && pendingRequests > 0 && <span className="sd-nav-badge">{pendingRequests}</span>}
            </button>
          ))}
        </nav>

        <div className="sd-user">
          <div className="sd-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="sd-user-info">
            <p className="sd-user-name">{userName}</p>
            <p className="sd-user-role">Donator</p>
          </div>
          <button onClick={logout} className="sd-icon-btn-dark" title="Log out" aria-label="Log out"><LogOut size={17} /></button>
        </div>
      </aside>

      <div className="sd-shell">
        <header className="sd-header">
          <div className="sd-header-left">
            <button onClick={() => setSidebarOpen(true)} className="sd-icon-btn sd-menu-btn" aria-label="Open menu"><Menu size={19} /></button>
            <div>
              <p className="sd-header-kicker"></p>
              <h2 className="sd-header-title">{activeTab}</h2>
            </div>
          </div>
          <div className="sd-notif-wrap">
            <button onClick={() => setShowNotifications((v) => !v)} aria-label="Notifications" className="sd-icon-btn">
              <Bell size={18} />
              {pendingRequests > 0 && <span className="sd-dot" />}
            </button>
            {showNotifications && (
              <>
                <button className="sd-notif-backdrop" aria-label="Close notifications" onClick={() => setShowNotifications(false)} />
                <div className="sd-notif">
                  <strong>Notifications</strong>
                  <p>You have {pendingRequests} pending donation request{pendingRequests !== 1 ? "s" : ""}.</p>
                </div>
              </>
            )}
          </div>
          
        </header>

        <main className="sd-main">
          {activeTab === "Overview" && (
            <>
              <section className="sd-hero">
                <div className="sd-hero-copy">
                  <h1 className="sd-hero-title">Namaste, {firstName}. Your giving is reaching people.</h1>
                  <p className="sd-hero-text">
                    {pendingRequests > 0
                      ? `${pendingRequests} request${pendingRequests !== 1 ? "s are" : " is"} waiting for your review.`
                      : "All requests are reviewed. Share something new with your community."}
                  </p>
                  <div className="sd-hero-actions">
                    <button onClick={() => navigateTab("Post Donation")} className="sd-btn sd-btn-ghost "><Plus size={16} />Post donation</button>
                    <button onClick={() => navigateTab("Requests")} className="sd-btn sd-btn-ghost">Review requests</button>
                  </div>
                </div>
                <div className="sd-hero-stat">
                  <span className="sd-hero-num">{totalPeopleReached}</span>
                  <span className="sd-hero-label">people reached through your donations</span>
                </div>
              </section>

              <section className="sd-stats">
                {stats.map((s) => (
                  <div key={s.label} className={`sd-stat ${s.tone}`}>
                    <div className="sd-stat-icon">{s.icon}</div>
                    <p className="sd-stat-value">{s.value}</p>
                    <p className="sd-stat-label">{s.label}</p>
                  </div>
                ))}
              </section>

              <section>
                <SectionTitle title="Recent donations" subtitle="Your latest activity" action="View all" onAction={() => navigateTab("My Donations")} />
                <DonationGrid donations={donations.slice(0, 3)} onView={setSelectedDonation} onCreate={() => navigateTab("Post Donation")} />
              </section>

              <section>
                <SectionTitle title="Donation requests" subtitle="Requests from your community" action="View all" onAction={() => navigateTab("Requests")} />
                <RequestList requests={requests.slice(0, 3)} onReview={setSelectedRequest} />
              </section>
            </>
          )}

          {activeTab === "Post Donation" && (
            <section className="sd-narrow">
              <SectionTitle title="Post a donation" subtitle="Add the details of what you want to share." />
              <form onSubmit={handlePostDonation} className="sd-card sd-form">
                <div>
                  <label className="sd-label">Donation type</label>
                  <div className="sd-type-pick">
                    {[...BASE_TYPES, ...customTypes].map((type) => {
                      const { Icon, btn } = typeMeta(type);
                      return (
                        <button key={type} type="button" onClick={() => setForm({ ...form, type })} className={`sd-type-btn sd-type-btn--${btn} ${form.type === type ? "is-active" : ""}`}>
                          <span className="sd-type-icon"><Icon size={18} /></span>
                          <span className="sd-type-name">{type}</span>
                        </button>
                      );
                    })}
                    <button type="button" onClick={() => setForm({ ...form, type: NEW_TYPE })} className={`sd-type-btn sd-type-btn--other sd-type-btn--new ${form.type === NEW_TYPE ? "is-active" : ""}`}>
                      <span className="sd-type-icon"><Plus size={18} /></span>
                      <span className="sd-type-name">Add new type</span>
                    </button>
                  </div>
                  {form.type === NEW_TYPE && (
                    <div className="sd-custom-type">
                      <label className="sd-label" htmlFor="don-custom-type">New type name</label>
                      <input id="don-custom-type" className="sd-input" value={form.customType} maxLength={24} onChange={(e) => setForm({ ...form, customType: e.target.value })} placeholder="e.g. Books, Blankets, Medicines" required autoFocus />
                      <p className="sd-hint">Ye type aapki next donations ke liye bhi save rahega.</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="sd-label" htmlFor="don-title">Donation title</label>
                  <input id="don-title" className="sd-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Grocery Essentials" required />
                </div>
                <div>
                  <label className="sd-label" htmlFor="don-desc">Description</label>
                  <textarea id="don-desc" className="sd-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe what you are donating..." required />
                </div>
                <div>
                  <label className="sd-label" htmlFor="don-qty">Quantity</label>
                  <input id="don-qty" className="sd-input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 5 items / 10 meals" required />
                </div>
                <div className="sd-form-actions">
                  <button className="sd-btn sd-btn-primary">Publish donation</button>
                  <button type="button" onClick={() => navigateTab("Overview")} className="sd-btn sd-btn-outline">Cancel</button>
                </div>
              </form>
            </section>
          )}

          {activeTab === "My Donations" && (
            <section>
              <SectionTitle title="My donations" subtitle="Manage the donations you have posted." />
              <div className="sd-chips">
                {(["All", "Active", "Completed"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className={`sd-chip ${filter === f ? "is-active" : ""}`}>{f}</button>
                ))}
              </div>
              <DonationGrid donations={visibleDonations} onView={setSelectedDonation} onCreate={() => navigateTab("Post Donation")} />
            </section>
          )}

          {activeTab === "Requests" && (
            <section>
              <SectionTitle title="Donation requests" subtitle="Review requests from people in your community." />
              <RequestList requests={requests} onReview={setSelectedRequest} />
            </section>
          )}

          {activeTab === "Account" && (
            <section className="sd-narrow sd-stack">
              <SectionTitle title="Account" subtitle="Your profile and preferences." />
              <div className="sd-card">
                <div className="sd-profile-head">
                  <div className="sd-avatar">{userName.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3 className="sd-profile-name">{userName}</h3>
                    <p className="sd-profile-role">Donator account</p>
                  </div>
                </div>
                <div className="sd-fields">
                  <ProfileField label="Name" value={user?.name || "Not available"} />
                  <ProfileField label="Phone" value={user?.phone || "Not available"} />
                  <ProfileField label="Email" value={user?.email || "Not available"} />
                  <ProfileField label="City" value={user?.location?.city || "Not available"} />
                </div>
              </div>
              
              <button onClick={logout} className="sd-btn sd-btn-outline sd-btn-block sd-logout"><LogOut size={16} />Log out</button>
              <p className="sd-note">Notification preferences currently apply to this page only and are not saved to the server.</p>
            </section>
          )}
        </main>
      </div>

      {selectedDonation && (
        <Modal title={selectedDonation.title} onClose={() => setSelectedDonation(null)}>
          <p className="sd-modal-text">{selectedDonation.description}</p>
          <div className="sd-info-grid">
            <InfoBox label="Type" value={selectedDonation.type} />
            <InfoBox label="Quantity" value={selectedDonation.quantity} />
            <InfoBox label="Requests" value={String(selectedDonation.requests)} />
            <InfoBox label="Status" value={selectedDonation.status} />
          </div>
          <div className="sd-modal-actions"><button onClick={() => setSelectedDonation(null)} className="sd-btn sd-btn-primary">Close</button></div>
        </Modal>
      )}

      {selectedRequest && (
        <Modal title="Review request" onClose={() => setSelectedRequest(null)}>
          <p className="sd-modal-text"><strong>{selectedRequest.receiver}</strong> requested <strong>{selectedRequest.item}</strong>.</p>
          <div className="sd-info-grid">
            <InfoBox label="Date" value={selectedRequest.date} />
            <InfoBox label="Status" value={selectedRequest.status} />
          </div>
          {selectedRequest.status === "Pending" ? (
            <div className="sd-modal-actions">
              <button onClick={() => updateRequest(selectedRequest.id, "Approved")} className="sd-btn sd-btn-primary"><Check size={16} />Approve</button>
              <button onClick={() => updateRequest(selectedRequest.id, "Rejected")} className="sd-btn sd-btn-danger"><XCircle size={16} />Reject</button>
            </div>
          ) : (
            <div className="sd-modal-actions"><button onClick={() => setSelectedRequest(null)} className="sd-btn sd-btn-outline">Close</button></div>
          )}
        </Modal>
      )}
    </div>
  );
}

function SectionTitle({ title, subtitle, action, onAction }: { title: string; subtitle?: string; action?: string; onAction?: () => void }) {
  return (
    <div className="sd-section-head">
      <div>
        <h2 className="sd-section-title">{title}</h2>
        {subtitle && <p className="sd-section-sub">{subtitle}</p>}
      </div>
      {action && <button onClick={onAction} className="sd-link-btn">{action}</button>}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return <span className={`sd-pill sd-pill--${status}`}>{status}</span>;
}

function DonationGrid({ donations, onView, onCreate }: { donations: Donation[]; onView: (d: Donation) => void; onCreate: () => void }) {
  if (!donations.length) {
    return (
      <div className="sd-empty">
        <span className="sd-empty-icon"><Heart size={22} /></span>
        <p>No donations here yet.</p>
        <button onClick={onCreate} className="sd-btn sd-btn-primary sd-btn-sm"><Plus size={15} />Post a donation</button>
      </div>
    );
  }
  return (
    <div className="sd-grid">
      {donations.map((d) => {
        const { Icon, tone } = typeMeta(d.type);
        return (
        <article key={d.id} className={`sd-donation ${tone}`}>
          <div className="sd-donation-top">
            <span className="sd-type-icon"><Icon size={19} /></span>
            <StatusPill status={d.status} />
          </div>
          <h3 className="sd-donation-title">{d.title}</h3>
          <p className="sd-donation-meta">{d.type}, {d.quantity}</p>
          <p className="sd-donation-desc">{d.description}</p>
          <div className="sd-donation-foot">
            <span>{d.requests} request{d.requests !== 1 ? "s" : ""}</span>
            <button onClick={() => onView(d)} className="sd-link-btn"><Eye size={15} />Details</button>
          </div>
        </article>
        );
      })}
    </div>
  );
}

function RequestList({ requests, onReview }: { requests: DonationRequest[]; onReview: (r: DonationRequest) => void }) {
  if (!requests.length) {
    return (
      <div className="sd-empty">
        <span className="sd-empty-icon"><Inbox size={22} /></span>
        <p>No requests yet. They will show up here when someone asks for your items.</p>
      </div>
    );
  }
  return (
    <div className="sd-list">
      {requests.map((r) => (
        <div key={r.id} className="sd-row">
          <div className="sd-row-main">
            <span className="sd-row-avatar">{r.receiver.charAt(0).toUpperCase()}</span>
            <div style={{ minWidth: 0 }}>
              <p className="sd-row-title">{r.item}</p>
              <p className="sd-row-sub">{r.receiver}, {r.date}</p>
            </div>
          </div>
          <div className="sd-row-side">
            <StatusPill status={r.status} />
            <button onClick={() => onReview(r)} className="sd-btn sd-btn-outline sd-btn-sm">Review</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="sd-toggle-row">
      <div>
        <p className="sd-toggle-title">{title}</p>
        <p className="sd-toggle-desc">{description}</p>
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-label={title} onClick={() => onChange(!checked)} className="sd-switch" />
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="sd-field">
      <p className="sd-field-label">{label}</p>
      <p className="sd-field-value">{value}</p>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="sd-field">
      <p className="sd-field-label">{label}</p>
      <p className="sd-field-value">{value}</p>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="sd-modal-backdrop" onMouseDown={onClose}>
      <div className="sd-modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
        <div className="sd-modal-head">
          <h3 className="sd-modal-title">{title}</h3>
          <button onClick={onClose} aria-label="Close dialog" className="sd-modal-close"><X size={19} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}