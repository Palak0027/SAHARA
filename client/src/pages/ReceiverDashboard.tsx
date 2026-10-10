
import { useMemo, useState } from "react";
import {
  Bell, ChevronDown, HeartHandshake, Home, Search, Package,
  Settings, Menu, X, LogOut, MapPin, Clock, CheckCircle2,
  Eye, Send, Utensils, Shirt, UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

type Tab = "Overview" | "Find Donations" | "My Requests" | "Account";
type DonationStatus = "Available" | "Requested";
type RequestStatus = "Pending" | "Approved" | "Completed";

type Donation = {
  id: number;
  type: "Food" | "Clothes";
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

export default function ReceiverDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);

  const [donations, setDonations] = useState<Donation[]>([
    { id: 1, type: "Food", title: "Grocery Essentials", description: "Rice, flour, sugar and other grocery items available for nearby families.", quantity: "5 items", location: "Kanpur", distance: "1.2 km", status: "Available" },
    { id: 2, type: "Clothes", title: "Winter Clothes", description: "Clean and gently-used winter clothes for adults and children.", quantity: "8 items", location: "Kakadeo", distance: "2.4 km", status: "Available" },
    { id: 3, type: "Food", title: "Packed Meals", description: "Freshly prepared meals available for nearby community members.", quantity: "10 meals", location: "Swaroop Nagar", distance: "3.1 km", status: "Available" },
    { id: 4, type: "Clothes", title: "Children's Clothes", description: "Gently-used children's clothing available for families in need.", quantity: "12 items", location: "Arya Nagar", distance: "4.2 km", status: "Available" },
  ]);

  const [requests, setRequests] = useState<DonationRequest[]>([
    { id: 1, item: "Grocery Essentials", donor: "Community Donor", status: "Pending", date: "Today" },
    { id: 2, item: "Winter Clothes", donor: "Local Donor", status: "Approved", date: "Yesterday" },
  ]);

  const userName = user?.name || "User";
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;
  const approvedRequests = requests.filter((r) => r.status === "Approved").length;
  const availableDonations = donations.filter((d) => d.status === "Available").length;

  const filteredDonations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return donations;
    return donations.filter((d) => `${d.title} ${d.type} ${d.location} ${d.description}`.toLowerCase().includes(q));
  }, [donations, search]);

  const navigateTab = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const requestDonation = (donation: Donation) => {
    setDonations((prev) => prev.map((d) => d.id === donation.id ? { ...d, status: "Requested" } : d));
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

  const inputClass = "w-full rounded-lg border border-[#D9E1DB] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F7C68] focus:ring-2 focus:ring-[#E5F0E8]";
  const cardClass = "rounded-xl border border-[#DDE6DF] bg-white p-4";

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#26332F]">
      {sidebarOpen && <button aria-label="Close menu overlay" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/30 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#DDE5DF] bg-[#FAF8F3] transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-26 items-center justify-between border-b border-[#E3E9E4] px-4">
          <div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5547] text-white"><HeartHandshake size={19} /></div><div><h1 className="text-xl font-bold text-[#2F5547]">SAHARA</h1><p className="text-[10px] text-[#71817A]">Community Care</p></div></div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={19} /></button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-[#9AA8A0]">Dashboard</p>
          {navigation.map((item) => <button key={item.name} onClick={() => navigateTab(item.name)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${activeTab === item.name ? "bg-[#E5F0E8] text-[#2F5547]" : "text-[#71817A] hover:bg-white hover:text-[#2F5547]"}`}>{item.icon}{item.name}</button>)}
        </nav>

        <div className="border-t border-[#E3E9E4] p-3"><div className="flex items-center gap-2 rounded-lg bg-white p-2.5"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDE9DF] text-sm font-bold text-[#2F5547]">{userName.charAt(0).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{userName}</p><p className="text-xs text-[#8A9890]">Receiver</p></div><button onClick={logout} className="rounded-md p-1.5 text-[#8A9890] hover:bg-red-50 hover:text-red-600" title="Logout"><LogOut size={16} /></button></div></div>
      </aside>

      <div className="min-w-0 lg:pl-70">
        <header className="sticky top-0 z-30 flex h-26 items-center justify-between border-b border-[#E1E7E2] bg-[#F7F8F5]/95 px-6 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3"><button onClick={() => setSidebarOpen(true)} className="rounded-lg border bg-white p-4 lg:hidden" aria-label="Open menu"><Menu size={19} /></button><div><p className="text-[11px] text-[#8A9890]">Receiver Dashboard</p><h2 className="text-base font-bold sm:text-lg">Welcome back, {userName.split(" ")[0]} 👋</h2></div></div>
          <div className="relative"><button onClick={() => setShowNotifications((v) => !v)} aria-label="Notifications" className="relative rounded-lg border border-[#D9E1DB] bg-white p-2 text-[#607068]"><Bell size={18} />{pendingRequests > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#4F7C68]" />}</button>{showNotifications && <div className="absolute right-0 top-11 z-50 w-64 rounded-xl border bg-white p-3 shadow-lg"><p className="text-sm font-semibold">Notifications</p><p className="mt-1 text-xs text-[#71817A]">You have {pendingRequests} pending request{pendingRequests !== 1 ? "s" : ""}.</p></div>}</div>
        </header>

        <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
          {activeTab === "Overview" && <>
            <section><h1 className="text-2xl font-bold">Find Help Nearby</h1><p className="mt-1 text-sm text-[#71817A]">Find useful donations from people in your community.</p></section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Available donations", value: availableDonations, icon: <Search size={19} /> },
                { label: "My requests", value: requests.length, icon: <Package size={19} /> },
                { label: "Pending requests", value: pendingRequests, icon: <Clock size={19} /> },
                { label: "Approved requests", value: approvedRequests, icon: <CheckCircle2 size={19} /> },
              ].map((stat) => <div key={stat.label} className={cardClass}><div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#EDF5EF] text-[#4F7C68]">{stat.icon}</div><p className="text-2xl font-bold">{stat.value}</p><p className="mt-1 text-xs text-[#71817A]">{stat.label}</p></div>)}
            </section>

            <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#2F5547] p-4 text-white"><div className="flex items-center gap-3"><HeartHandshake size={23} /><div><h3 className="font-semibold">Looking for something?</h3><p className="text-xs text-[#C8D9CE]">Explore food and clothes available nearby.</p></div></div><button onClick={() => navigateTab("Find Donations")} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#2F5547]"><Search size={15} className="mr-1 inline" />Find Donations</button></section>

            <section><SectionTitle title="Available Donations" subtitle="Explore items near you" action="View all" onAction={() => navigateTab("Find Donations")} /><DonationGrid donations={donations.filter((d) => d.status === "Available").slice(0, 3)} onView={setSelectedDonation} onRequest={requestDonation} /></section>
          </>}

          {activeTab === "Find Donations" && <section><SectionTitle title="Find Donations" subtitle="Search available items by name, type, or location." /><div className="relative mb-4 max-w-xl"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9890]" /><input className={`${inputClass} pl-9`} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search food, clothes, location..." /></div><DonationGrid donations={filteredDonations} onView={setSelectedDonation} onRequest={requestDonation} /></section>}

          {activeTab === "My Requests" && <section><SectionTitle title="My Requests" subtitle="Track the status of your donation requests." /><div className="overflow-hidden rounded-xl border border-[#DDE6DF] bg-white">{requests.length === 0 ? <p className="p-4 text-sm text-[#71817A]">You have not requested any donations yet.</p> : requests.map((r, i) => <div key={r.id} className={`flex flex-wrap items-center justify-between gap-3 px-3 py-3 ${i ? "border-t border-[#E8EDE9]" : ""}`}><div className="flex items-center gap-2.5"><span className="rounded-lg bg-[#EDF5EF] p-2 text-[#4F7C68]"><Package size={17} /></span><div><p className="text-sm font-semibold">{r.item}</p><p className="text-xs text-[#71817A]">{r.donor} · {r.date}</p></div></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${r.status === "Approved" ? "bg-[#E5F3E8] text-[#397151]" : r.status === "Completed" ? "bg-gray-100 text-gray-600" : "bg-[#FFF1E8] text-[#B56C43]"}`}>{r.status}</span></div>)}</div></section>}

          {activeTab === "Account" && <section className="mx-auto max-w-2xl space-y-4">
            <SectionTitle title="Account" subtitle="Your profile and preferences in one place." />
            <div className={cardClass}><div className="flex items-center gap-3 border-b border-[#E8EDE9] pb-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDE9DF] font-bold text-[#2F5547]">{userName.charAt(0).toUpperCase()}</div><div><h3 className="font-semibold">{userName}</h3><p className="text-xs text-[#71817A]">Receiver account</p></div></div><div className="grid gap-3 py-3 sm:grid-cols-2"><ProfileField label="Name" value={user?.name || "Not available"} /><ProfileField label="Phone" value={user?.phone || "Not available"} /><ProfileField label="Email" value={user?.email || "Not available"} /><ProfileField label="City" value={user?.location?.city || "Not available"} /></div></div>
            <div className={`${cardClass} space-y-1`}><h3 className="mb-2 text-sm font-semibold">Notification preferences</h3><ToggleRow title="Email notifications" description="Receive updates by email." checked={emailNotifications} onChange={setEmailNotifications} /><ToggleRow title="In-app notifications" description="Show updates in SAHARA." checked={appNotifications} onChange={setAppNotifications} /></div>
            <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"><LogOut size={16} />Log out</button>
            <p className="text-xs text-[#8A9890]">Notification preferences currently apply to this page only and are not saved to the server.</p>
          </section>}
        </main>
      </div>

      {selectedDonation && <Modal title={selectedDonation.title} onClose={() => setSelectedDonation(null)}><p className="text-sm text-[#71817A]">{selectedDonation.description}</p><div className="grid grid-cols-2 gap-2"><InfoBox label="Type" value={selectedDonation.type} /><InfoBox label="Quantity" value={selectedDonation.quantity} /><InfoBox label="Location" value={selectedDonation.location} /><InfoBox label="Distance" value={selectedDonation.distance} /></div><div className="flex gap-2"><button disabled={selectedDonation.status !== "Available"} onClick={() => requestDonation(selectedDonation)} className="rounded-lg bg-[#4F7C68] px-3 py-2 text-sm text-white disabled:opacity-50"><Send size={14} className="mr-1 inline" />Request donation</button><button onClick={() => setSelectedDonation(null)} className="rounded-lg border px-3 py-2 text-sm">Close</button></div></Modal>}
    </div>
  );
}

function SectionTitle({ title, subtitle, action, onAction }: { title: string; subtitle?: string; action?: string; onAction?: () => void }) {
  return <div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-xl font-bold">{title}</h2>{subtitle && <p className="mt-1 text-xs text-[#71817A]">{subtitle}</p>}</div>{action && <button onClick={onAction} className="text-xs font-semibold text-[#4F7C68]">{action} →</button>}</div>;
}

function DonationGrid({ donations, onView, onRequest }: { donations: Donation[]; onView: (d: Donation) => void; onRequest: (d: Donation) => void }) {
  if (!donations.length) return <div className="rounded-xl border bg-white p-5 text-sm text-[#71817A]">No donations found.</div>;
  return <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{donations.map((d) => <article key={d.id} className="rounded-xl border border-[#DDE6DF] bg-white p-4"><div className="mb-3 flex items-center justify-between"><span className={`rounded-lg p-2 ${d.type === "Food" ? "bg-[#FFF2E9] text-[#C8794D]" : "bg-[#EDF5EF] text-[#4F7C68]"}`}>{d.type === "Food" ? <Utensils size={18} /> : <Shirt size={18} />}</span><span className="rounded-full bg-[#E5F3E8] px-2.5 py-1 text-[11px] font-medium text-[#397151]">{d.status}</span></div><h3 className="font-semibold">{d.title}</h3><p className="mt-1 text-xs text-[#71817A]">{d.type} · {d.quantity}</p><p className="mt-2 line-clamp-2 text-xs text-[#71817A]">{d.description}</p><p className="mt-2 flex items-center gap-1 text-xs text-[#71817A]"><MapPin size={13} />{d.location} · {d.distance}</p><div className="mt-3 flex gap-2 border-t border-[#E8EDE9] pt-3"><button onClick={() => onView(d)} className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs"><Eye size={14} />Details</button><button disabled={d.status !== "Available"} onClick={() => onRequest(d)} className="rounded-md bg-[#4F7C68] px-2.5 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">{d.status === "Available" ? "Request" : "Requested"}</button></div></article>)}</div>;
}

function ToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <div className="flex items-center justify-between gap-3 border-t border-[#E8EDE9] py-2.5"><div><p className="text-sm font-medium">{title}</p><p className="mt-0.5 text-xs text-[#71817A]">{description}</p></div><button type="button" role="switch" aria-checked={checked} aria-label={title} onClick={() => onChange(!checked)} className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked ? "bg-[#4F7C68]" : "bg-gray-300"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${checked ? "left-[18px]" : "left-0.5"}`} /></button></div>;
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#F7F8F5] px-3 py-2"><p className="text-[10px] text-[#8A9890]">{label}</p><p className="mt-0.5 break-words text-sm font-medium">{value}</p></div>;
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#F7F8F5] p-3"><p className="text-[10px] text-[#8A9890]">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>;
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4" onMouseDown={onClose}><div className="w-full max-w-md space-y-4 rounded-xl bg-white p-4 shadow-xl" onMouseDown={(e) => e.stopPropagation()}><div className="flex items-center justify-between gap-3"><h3 className="text-lg font-bold">{title}</h3><button onClick={onClose} aria-label="Close dialog" className="rounded-md p-1.5 hover:bg-gray-100"><X size={18} /></button></div>{children}</div></div>;
}
