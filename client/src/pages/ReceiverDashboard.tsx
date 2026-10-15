import { useMemo, useState } from "react";
import {
  Bell, Gift, Home, Search, Package, Settings, Menu, X, LogOut, MapPin, Clock,
  CheckCircle2, Eye, Send, Utensils, Shirt, UserRound, Inbox, Plus,
} from "lucide-react";
import logoImg from "../components/image/sahara-logo.jpeg";
import { useAuth } from "../context/AuthContext";
import "../styles/ReceiverDashboard.css";

type Tab = "Overview" | "Find Donations" | "My Requests" | "Account";
type DonationStatus = "Available" | "Requested";
type RequestStatus = "Pending" | "Approved" | "Completed";

type Donation = {
  id: number;
  type: string; // Food, Clothes ya donor ka banaya hua koi bhi type
  title: string;
  description: string;
  quantity: string;
  location: string;
  distance: string;
  status: DonationStatus;
};

type DonationRequest = {
  id: number;
  item: string;
  donor: string;
  status: RequestStatus;
  date: string;
};

const typeMeta = (type: string) => {
  if (type === "Food") return { Icon: Utensils, tone: "" };
  if (type === "Clothes") return { Icon: Shirt, tone: "rd-donation--clothes" };
  return { Icon: Gift, tone: "rd-donation--other" };
};

export default function ReceiverDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);

  const [donations, setDonations] = useState<Donation[]>([
    { id: 1, type: "Food", title: "Rice", description: "Rice available for nearby families.", quantity: "5 bags", location: "Kanpur", distance: "1.2 km", status: "Available" },
    { id: 2, type: "Clothes", title: "Winter Jackets", description: "Clean, gently-used winter jackets for adults and children.", quantity: "8 jackets", location: "Kakadeo", distance: "2.4 km", status: "Available" },
    { id: 3, type: "Food", title: "Cooked Meals", description: "Freshly prepared meals available for nearby community members.", quantity: "10 meals", location: "Swaroop Nagar", distance: "3.1 km", status: "Available" },
    { id: 4, type: "Clothes", title: "Children's Shirts", description: "Gently-used children's shirts available for families in need.", quantity: "12 shirts", location: "Arya Nagar", distance: "4.2 km", status: "Available" },
  ]);

  const [requests, setRequests] = useState<DonationRequest[]>([
    { id: 1, item: "Rice", donor: "Community Donor", status: "Pending", date: "Today" },
    { id: 2, item: "Winter Jackets", donor: "Local Donor", status: "Approved", date: "Yesterday" },
  ]);

  const userName = user?.name || "User";
  const firstName = userName.split(" ")[0];
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;
  const approvedRequests = requests.filter((r) => r.status === "Approved").length;
  const availableDonations = donations.filter((d) => d.status === "Available").length;

  const typeOptions = useMemo(() => ["All", ...Array.from(new Set(donations.map((d) => d.type)))], [donations]);

  const filteredDonations = useMemo(() => {
    const q = search.trim().toLowerCase();
    return donations.filter((d) => {
      const matchesType = typeFilter === "All" || d.type === typeFilter;
      const matchesText = !q || `${d.title} ${d.type} ${d.location} ${d.description}`.toLowerCase().includes(q);
      return matchesType && matchesText;
    });
  }, [donations, search, typeFilter]);

  const navigateTab = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    setShowNotifications(false);
    setShowAccountMenu(false);
  };

  const requestDonation = (donation: Donation) => {
    setDonations((prev) => prev.map((d) => (d.id === donation.id ? { ...d, status: "Requested" } : d)));
    if (!requests.some((r) => r.item === donation.title)) {
      setRequests((prev) => [{ id: Date.now(), item: donation.title, donor: "Community Donor", status: "Pending", date: "Just now" }, ...prev]);
    }
    setSelectedDonation(null);
    navigateTab("My Requests");
  };

  const navigation: { name: Tab; icon: React.ReactNode }[] = [
    { name: "Overview", icon: <Home size={18} /> },
    { name: "Find Donations", icon: <Search size={18} /> },
    { name: "My Requests", icon: <Package size={18} /> },
    { name: "Account", icon: <Settings size={18} /> },
  ];

  const stats = [
    { label: "Available donations", value: availableDonations, icon: <Search size={19} />, tone: "" },
    { label: "My requests", value: requests.length, icon: <Package size={19} />, tone: "rd-stat--people" },
    { label: "Pending requests", value: pendingRequests, icon: <Clock size={19} />, tone: "rd-stat--pending" },
    { label: "Approved requests", value: approvedRequests, icon: <CheckCircle2 size={19} />, tone: "rd-stat--done" },
  ];

  return (
    <div className="rd">
      {sidebarOpen && <button aria-label="Close menu overlay" onClick={() => setSidebarOpen(false)} className="rd-overlay" />}

      <aside className={`rd-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="rd-brand">
          <div className="rd-brand-main">
            <img src={logoImg} alt="SAHARA logo" className="rd-logo" />
            <div>
              <h1 className="rd-brand-name">SAHARA</h1>
              <p className="rd-brand-tag">Community Care</p>
            </div>
          </div>
          <button className="rd-close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="rd-nav" aria-label="Dashboard">
          {navigation.map((item) => (
            <button key={item.name} onClick={() => navigateTab(item.name)} className={`rd-nav-btn ${activeTab === item.name ? "is-active" : ""}`}>
              {item.icon}
              {item.name}
              {item.name === "My Requests" && pendingRequests > 0 && <span className="rd-nav-badge">{pendingRequests}</span>}
            </button>
          ))}
        </nav>

        <div className="rd-user">
          <div className="rd-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="rd-user-info">
            <p className="rd-user-name">{userName}</p>
            <p className="rd-user-role">Receiver</p>
          </div>
          <button onClick={logout} className="rd-icon-btn-dark" title="Log out" aria-label="Log out"><LogOut size={17} /></button>
        </div>
      </aside>

      <div className="rd-shell">
        <header className="rd-header">
          <div className="rd-header-left">
            <button onClick={() => setSidebarOpen(true)} className="rd-icon-btn rd-menu-btn" aria-label="Open menu"><Menu size={19} /></button>
            <div>
              <p className="rd-header-kicker">Receiver Dashboard</p>
              <h2 className="rd-header-title">{activeTab}</h2>
            </div>
          </div>

          <div className="rd-header-actions">
            <div className="rd-notif-wrap">
              <button onClick={() => { setShowNotifications((v) => !v); setShowAccountMenu(false); }} aria-label="Notifications" className="rd-icon-btn">
                <Bell size={18} />
                {pendingRequests > 0 && <span className="rd-dot" />}
              </button>
              {showNotifications && (
                <>
                  <button className="rd-notif-backdrop" aria-label="Close notifications" onClick={() => setShowNotifications(false)} />
                  <div className="rd-notif">
                    <strong>Notifications</strong>
                    <p>You have {pendingRequests} pending request{pendingRequests !== 1 ? "s" : ""}.</p>
                  </div>
                </>
              )}
            </div>

            <div className="rd-notif-wrap">
              <button onClick={() => { setShowAccountMenu((v) => !v); setShowNotifications(false); }} aria-label="Account menu" aria-expanded={showAccountMenu} className="rd-icon-btn"><UserRound size={18} /></button>
              {showAccountMenu && (
                <>
                  <button className="rd-notif-backdrop" aria-label="Close account menu" onClick={() => setShowAccountMenu(false)} />
                  <div className="rd-menu">
                    <button onClick={() => navigateTab("Account")}>My Account &amp; Settings</button>
                    <button onClick={() => navigateTab("My Requests")}>My Requests</button>
                    <button className="is-danger" onClick={() => { setShowAccountMenu(false); logout(); }}>Log out</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="rd-main">
          {activeTab === "Overview" && (
            <>
              <section className="rd-hero">
                <div className="rd-hero-copy">
                  <h1 className="rd-hero-title">Namaste, {firstName}. Find help nearby.</h1>
                  <p className="rd-hero-text">
                    {availableDonations > 0
                      ? `${availableDonations} donation${availableDonations !== 1 ? "s are" : " is"} available from people in your community right now.`
                      : "No donations are available at the moment. Please check again soon."}
                  </p>
                  <div className="rd-hero-actions">
                    <button onClick={() => navigateTab("Find Donations")} className="rd-btn rd-btn-ghost"><Search size={16} />Find donations</button>
                    <button onClick={() => navigateTab("My Requests")} className="rd-btn rd-btn-ghost">My requests</button>
                  </div>
                </div>
                <div className="rd-hero-stat">
                  <span className="rd-hero-num">{availableDonations}</span>
                  <span className="rd-hero-label">donations ready for you</span>
                </div>
              </section>

              <section className="rd-stats">
                {stats.map((s) => (
                  <div key={s.label} className={`rd-stat ${s.tone}`}>
                    <div className="rd-stat-icon">{s.icon}</div>
                    <p className="rd-stat-value">{s.value}</p>
                    <p className="rd-stat-label">{s.label}</p>
                  </div>
                ))}
              </section>

              <section>
                <SectionTitle title="Available donations" subtitle="Explore items near you" action="View all" onAction={() => navigateTab("Find Donations")} />
                <DonationGrid donations={donations.filter((d) => d.status === "Available").slice(0, 3)} onView={setSelectedDonation} onRequest={requestDonation} />
              </section>
            </>
          )}

          {activeTab === "Find Donations" && (
            <section>
              <SectionTitle title="Find donations" subtitle="Search available items by name, type, or location." />
              <div className="rd-search">
                <Search size={17} />
                <input className="rd-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search food, clothes, location..." />
              </div>
              <div className="rd-chips">
                {typeOptions.map((t) => (
                  <button key={t} onClick={() => setTypeFilter(t)} className={`rd-chip ${typeFilter === t ? "is-active" : ""}`}>{t}</button>
                ))}
              </div>
              <DonationGrid donations={filteredDonations} onView={setSelectedDonation} onRequest={requestDonation} />
            </section>
          )}

          {activeTab === "My Requests" && (
            <section>
              <SectionTitle title="My requests" subtitle="Track the status of your donation requests." />
              {requests.length === 0 ? (
                <div className="rd-empty">
                  <span className="rd-empty-icon"><Inbox size={22} /></span>
                  <p>You have not requested any donations yet.</p>
                  <button onClick={() => navigateTab("Find Donations")} className="rd-btn rd-btn-primary rd-btn-sm"><Plus size={15} />Find donations</button>
                </div>
              ) : (
                <div className="rd-list">
                  {requests.map((r) => (
                    <div key={r.id} className="rd-row">
                      <div className="rd-row-main">
                        <span className="rd-row-avatar"><Package size={18} /></span>
                        <div style={{ minWidth: 0 }}>
                          <p className="rd-row-title">{r.item}</p>
                          <p className="rd-row-sub">{r.donor}, {r.date}</p>
                        </div>
                      </div>
                      <StatusPill status={r.status} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "Account" && (
            <section className="rd-narrow rd-stack">
              <SectionTitle title="Account" subtitle="Your profile and preferences." />
              <div className="rd-card">
                <div className="rd-profile-head">
                  <div className="rd-avatar">{userName.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3 className="rd-profile-name">{userName}</h3>
                    <p className="rd-profile-role">Receiver account</p>
                  </div>
                </div>
                <div className="rd-fields">
                  <ProfileField label="Name" value={user?.name || "Not available"} />
                  <ProfileField label="Phone" value={user?.phone || "Not available"} />
                  <ProfileField label="Email" value={user?.email || "Not available"} />
                  <ProfileField label="City" value={user?.location?.city || "Not available"} />
                </div>
              </div>
              
              <button onClick={logout} className="rd-btn rd-btn-outline rd-btn-block rd-logout"><LogOut size={16} />Log out</button>
              <p className="rd-note">Notification preferences currently apply to this page only and are not saved to the server.</p>
            </section>
          )}
        </main>
      </div>

      {selectedDonation && (
        <Modal title="Donation details" onClose={() => setSelectedDonation(null)}>
          {(() => {
            const { Icon, tone } = typeMeta(selectedDonation.type);
            const alreadyRequested = requests.some((r) => r.item === selectedDonation.title);
            return (
              <>
                <div className={`rd-detail ${tone}`}>
                  <div className="rd-detail-icon"><Icon size={28} /></div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="rd-tags">
                      <span className="rd-tag">{selectedDonation.type}</span>
                      <StatusPill status={selectedDonation.status} />
                    </div>
                    <p className="rd-eyebrow">Item name</p>
                    <h4 className="rd-detail-title">{selectedDonation.title}</h4>
                    <p className="rd-detail-text">{selectedDonation.description}</p>
                  </div>
                </div>

                <div className="rd-info-grid">
                  <InfoBox label="Category" value={selectedDonation.type} />
                  <InfoBox label="Total quantity" value={selectedDonation.quantity} />
                  <InfoBox label="Pickup location" value={selectedDonation.location} />
                  <InfoBox label="Distance from you" value={selectedDonation.distance} />
                  <InfoBox label="Availability status" value={selectedDonation.status} />
                  <InfoBox label="Requested by" value={alreadyRequested ? userName : "Not requested yet"} />
                </div>

                <div className="rd-two">
                  <div className="rd-person">
                    <span className="rd-person-icon"><UserRound size={19} /></span>
                    <div><small>Donor information</small><strong>Community Donor</strong><span>SAHARA community</span></div>
                  </div>
                  <div className="rd-person">
                    <span className="rd-person-icon"><MapPin size={19} /></span>
                    <div><small>Pickup area</small><strong>{selectedDonation.location}</strong><span>Approximately {selectedDonation.distance} away</span></div>
                  </div>
                </div>

                <div className="rd-modal-actions">
                  <button disabled={selectedDonation.status !== "Available"} onClick={() => requestDonation(selectedDonation)} className="rd-btn rd-btn-primary">
                    <Send size={15} />{selectedDonation.status === "Available" ? "Request donation" : "Already requested"}
                  </button>
                  <button onClick={() => setSelectedDonation(null)} className="rd-btn rd-btn-outline">Close</button>
                </div>
              </>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}

function SectionTitle({ title, subtitle, action, onAction }: { title: string; subtitle?: string; action?: string; onAction?: () => void }) {
  return (
    <div className="rd-section-head">
      <div>
        <h2 className="rd-section-title">{title}</h2>
        {subtitle && <p className="rd-section-sub">{subtitle}</p>}
      </div>
      {action && <button onClick={onAction} className="rd-link-btn">{action}</button>}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return <span className={`rd-pill rd-pill--${status}`}>{status}</span>;
}

function DonationGrid({ donations, onView, onRequest }: { donations: Donation[]; onView: (d: Donation) => void; onRequest: (d: Donation) => void }) {
  if (!donations.length) {
    return (
      <div className="rd-empty">
        <span className="rd-empty-icon"><Search size={22} /></span>
        <p>No donations found.</p>
      </div>
    );
  }
  return (
    <div className="rd-grid">
      {donations.map((d) => {
        const { Icon, tone } = typeMeta(d.type);
        return (
          <article key={d.id} className={`rd-donation ${tone}`}>
            <div className="rd-donation-top">
              <span className="rd-type-icon"><Icon size={19} /></span>
              <StatusPill status={d.status} />
            </div>
            <h3 className="rd-donation-title">{d.title}</h3>
            <p className="rd-donation-meta">{d.type}, {d.quantity}</p>
            <p className="rd-donation-desc">{d.description}</p>
            <p className="rd-place"><MapPin size={14} />{d.location}, {d.distance}</p>
            <div className="rd-card-actions">
              <button onClick={() => onView(d)} className="rd-btn rd-btn-outline rd-btn-sm"><Eye size={14} />Details</button>
              <button disabled={d.status !== "Available"} onClick={() => onRequest(d)} className="rd-btn rd-btn-primary rd-btn-sm">
                {d.status === "Available" ? "Request" : "Requested"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="rd-toggle-row">
      <div>
        <p className="rd-toggle-title">{title}</p>
        <p className="rd-toggle-desc">{description}</p>
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-label={title} onClick={() => onChange(!checked)} className="rd-switch" />
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rd-field">
      <p className="rd-field-label">{label}</p>
      <p className="rd-field-value">{value}</p>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return <ProfileField label={label} value={value} />;
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="rd-modal-backdrop" onMouseDown={onClose}>
      <section className="rd-modal rd-modal--wide" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
        <div className="rd-modal-head">
          <div>
            <h3 className="rd-modal-title">{title}</h3>
            <p className="rd-modal-sub">Here is all the information about this donation.</p>
          </div>
          <button onClick={onClose} aria-label="Close dialog" className="rd-modal-close"><X size={19} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}