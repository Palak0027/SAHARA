 import logoImg from '../components/image/sahara-logo.jpeg';
import { useState } from "react";
import {
  Bell, Heart, HeartHandshake, Home, Package, Plus,
  UserRound, Utensils, Shirt, Clock, CheckCircle2, Menu, X,
  LogOut, Users, ArrowUpRight, Eye, Check, XCircle, Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

type DonationStatus = "Active" | "Completed";
type RequestStatus = "Pending" | "Approved" | "Completed" | "Rejected";
type Tab = "Overview" | "Post Donation" | "My Donations" | "Requests" | "Account";

type Donation = {
  id: number;
  type: "Food" | "Clothes";
  title: string;
  description: string;
  quantity: string;
  location: string;
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
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);

  const [donations, setDonations] = useState<Donation[]>([
    { id: 1, type: "Food", title: "Rice", description: "Rice available for donation to nearby families.", quantity: "5 bags", location: "Kanpur", requests: 2, status: "Active" },
    { id: 2, type: "Clothes", title: "Winter Jackets", description: "Clean, gently-used winter jackets for adults and children.", quantity: "8 jackets", location: "Kakadeo, Kanpur", requests: 3, status: "Active" },
    { id: 3, type: "Food", title: "Cooked Meals", description: "Freshly prepared meals available for nearby families.", quantity: "10 meals", location: "Swaroop Nagar, Kanpur", requests: 1, status: "Completed" },
  ]);

  const [requests, setRequests] = useState<DonationRequest[]>([
    { id: 1, item: "Rice", receiver: "Nearby Family", status: "Pending", date: "Today" },
    { id: 2, item: "Winter Jackets", receiver: "Local Resident", status: "Approved", date: "Yesterday" },
    { id: 3, item: "Cooked Meals", receiver: "Community Member", status: "Completed", date: "24 Sep 2026" },
  ]);

  const [form, setForm] = useState({ type: "Food" as "Food" | "Clothes", title: "", description: "", quantity: "", location: "" });
  const userName = user?.name || "User";
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;
  const completedDonations = donations.filter((d) => d.status === "Completed").length;
  const totalPeopleReached = donations.reduce((sum, d) => sum + d.requests, 0);

  const navigateTab = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handlePostDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.quantity.trim() || !form.location.trim()) return;

    setDonations((prev) => [{
      id: Date.now(),
      ...form,
      requests: 0,
      status: "Active",
    }, ...prev]);

    setForm({ type: "Food", title: "", description: "", quantity: "", location: "" });
    navigateTab("My Donations");
  };

  const updateRequest = (id: number, status: "Approved" | "Rejected") => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    setSelectedRequest(null);
  };

  const navigation: { name: Tab; icon: React.ReactNode }[] = [
    { name: "Overview", icon: <Home size={18} /> },
    { name: "Post Donation", icon: <Plus size={18} /> },
    { name: "My Donations", icon: <Package size={18} /> },
    { name: "Requests", icon: <Users size={18} /> },
    { name: "Account", icon: <Settings size={18} /> },
  ];

  const inputClass = "w-full rounded-[6px] border border-[#D9E1DB] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F7C68] focus:ring-2 focus:ring-[#E5F0E8]";
  const cardClass = "rounded-[14px] border border-[#E0E7E1] bg-white p-[18px] shadow-[0_2px_8px_rgba(38,51,47,0.035)]";

  return (
    <div className="min-h-screen bg-[#F5F7F4] text-[#26332F]">
      {sidebarOpen && <button aria-label="Close menu overlay" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/30 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-[#DDE5DF] bg-[#FBFAF7] shadow-[2px_0_12px_rgba(38,51,47,0.02)] transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-[#E3E9E4] px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[6px] bg-[#2F5547] text-white">
              <img
            src={logoImg}
            alt=""
            className="h-[42px] w-[42px] shrink-0 rounded-full bg-white object-contain ring-1 ring-[#DCE6E1]"
          />
            </div>
            <div><h1 className="text-xl font-bold text-[#2F5547]">SAHARA</h1><p className="text-[10px] text-[#71817A]">Community Care</p></div>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={19} /></button>
        </div>

        <nav className="flex-3 space-y-1 overflow-y-auto p-3">
          <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-[#9AA8A0]">Dashboard</p>
          {navigation.map((item) => (
            <button key={item.name} onClick={() => navigateTab(item.name)} className={`flex w-full items-center gap-[10px] rounded-[6px] px-3 py-2.5 text-sm font-medium transition ${activeTab === item.name ? "bg-[#E5F0E8] text-[#2F5547]" : "text-[#71817A] hover:bg-white hover:text-[#2F5547]"}`}>
              {item.icon}{item.name}
            </button>
          ))}
        </nav>

      </aside>

      <div className="min-w-0 lg:pl-60">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#E1E7E2] bg-white/90 px-4 shadow-[0_1px_0_rgba(38,51,47,0.03)] backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-[10px]">
            <button onClick={() => setSidebarOpen(true)} className="rounded-[6px] border bg-white p-2 lg:hidden" aria-label="Open menu"><Menu size={19} /></button>
            <div><p className="text-[11px] text-[#8A9890]">Donator Dashboard</p><h2 className="text-base font-bold sm:text-lg">Welcome back, {userName.split(" ")[0]} 👋</h2></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => { setShowNotifications((v) => !v); setShowAccountMenu(false); }} aria-label="Notifications" className="relative inline-flex items-center justify-center rounded-[6px] border border-[#D9E1DB] bg-white p-2.5 text-[#607068] shadow-sm transition hover:bg-[#EDF5EF] hover:text-[#2F5547]"><Bell size={18} />{pendingRequests > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#4F7C68]" />}</button>
              {showNotifications && <div className="absolute right-0 top-11 z-50 w-64 rounded-[6px] border border-[#DDE6DF] bg-white p-3 shadow-lg"><p className="text-sm font-semibold">Notifications</p><p className="mt-1 text-xs text-[#71817A]">You have {pendingRequests} pending donation request{pendingRequests !== 1 ? "s" : ""}.</p></div>}
            </div>
            <div className="relative">
              <button onClick={() => { setShowAccountMenu((v) => !v); setShowNotifications(false); }} aria-label="Account menu" aria-expanded={showAccountMenu} className="inline-flex items-center justify-center rounded-[6px] border border-[#D9E1DB] bg-white p-2.5 text-[#607068] shadow-sm transition hover:bg-[#EDF5EF] hover:text-[#2F5547]"><UserRound size={18} /></button>
              {showAccountMenu && <div className="absolute right-0 top-11 z-50 w-52 rounded-[6px] border border-[#DDE6DF] bg-white p-1.5 shadow-lg">
                <button onClick={() => { navigateTab("Account"); setShowAccountMenu(false); }} className="w-full rounded-[6px] px-3 py-2 text-left text-sm text-[#26332F] hover:bg-[#F2F6F2]">My Account &amp; Settings</button>
                <button onClick={() => { navigateTab("My Donations"); setShowAccountMenu(false); }} className="w-full rounded-[6px] px-3 py-2 text-left text-sm text-[#26332F] hover:bg-[#F2F6F2]">My Donations</button>
                <button onClick={() => { setShowAccountMenu(false); logout(); }} className="w-full rounded-[6px] px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Log out</button>
              </div>}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          {activeTab === "Overview" && <>
            <section className="flex flex-wrap items-center justify-between gap-[10px]">
              <div><h1 className="text-2xl font-bold">Your Impact</h1><p className="mt-1 text-sm text-[#71817A]">Share what you can with your community.</p></div>
              <button onClick={() => navigateTab("Post Donation")} className="inline-flex items-center gap-2 rounded-[6px] bg-[#3F725E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#315D4C]"><Plus size={16} /> Post Donation</button>
            </section>

            <section className="grid gap-[10px] sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total donations", value: donations.length, icon: <Package size={19} /> },
                { label: "People reached", value: totalPeopleReached, icon: <Users size={19} /> },
                { label: "Completed donations", value: completedDonations, icon: <CheckCircle2 size={19} /> },
                { label: "Pending requests", value: pendingRequests, icon: <Clock size={19} /> },
              ].map((stat) => <div key={stat.label} className={cardClass}><div className="mb-[10px] flex h-[34px] w-[34px] items-center justify-center rounded-[6px] bg-[#EDF5EF] text-[#4F7C68]">{stat.icon}</div><p className="text-2xl font-bold">{stat.value}</p><p className="mt-1 text-xs text-[#71817A]">{stat.label}</p></div>)}
            </section>

            <section className="flex flex-wrap items-center justify-between gap-[10px] rounded-[14px] bg-[#2F5547] p-[14px] text-white">
              <div className="flex items-center gap-[10px]"><Heart size={23} /><div><h3 className="font-semibold">Have something to give?</h3><p className="text-xs text-[#C8D9CE]">Help someone nearby with useful items.</p></div></div>
              <button onClick={() => navigateTab("Post Donation")} className="rounded-[6px] bg-white px-3 py-2 text-sm font-semibold text-[#2F5547]"><Plus size={15} className="mr-1 inline" />Create Donation</button>
            </section>

            <section><SectionTitle title="My Donations" subtitle="Your recent activity" action="View all" onAction={() => navigateTab("My Donations")} /><DonationGrid donations={donations.slice(0, 3)} onView={setSelectedDonation} /></section>
            <section><SectionTitle title="Donation Requests" subtitle="Requests from your community" action="View all" onAction={() => navigateTab("Requests")} /><RequestList requests={requests.slice(0, 3)} onReview={setSelectedRequest} /></section>
          </>}

          {activeTab === "Post Donation" && <section className="mx-auto max-w-2xl"><SectionTitle title="Post a Donation" subtitle="Add the details of the item you want to share." /><form onSubmit={handlePostDonation} className={`${cardClass} space-y-4`}>
            <div><label className="mb-1.5 block text-sm font-medium">Donation type</label><div className="grid grid-cols-2 gap-2">{(["Food", "Clothes"] as const).map((type) => <button key={type} type="button" onClick={() => setForm({ ...form, type })} className={`rounded-[6px] border px-3 py-2.5 text-sm ${form.type === type ? "border-[#4F7C68] bg-[#EDF5EF] text-[#2F5547]" : "border-[#D9E1DB]"}`}>{type === "Food" ? "🍱 Food" : "👕 Clothes"}</button>)}</div></div>
            <div><label className="mb-1.5 block text-sm font-medium">Item name</label><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Rice, Wheat Flour, Winter Jacket" required /></div>
            <div><label className="mb-1.5 block text-sm font-medium">Description</label><textarea className={inputClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your donation..." required /></div>
            <div><label className="mb-1.5 block text-sm font-medium">Quantity / total items</label><input className={inputClass} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 5 items / 10 meals" required /></div>
            <div><label className="mb-1.5 block text-sm font-medium">Pickup location</label><input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Kakadeo, Kanpur" required /></div>
            <div className="flex gap-2"><button className="rounded-[6px] bg-[#4F7C68] px-4 py-2.5 text-sm font-semibold text-white">Publish Donation</button><button type="button" onClick={() => navigateTab("Overview")} className="rounded-[6px] border px-4 py-2.5 text-sm">Cancel</button></div>
          </form></section>}

          {activeTab === "My Donations" && <section><SectionTitle title="My Donations" subtitle="Manage the donations you have posted." /><DonationGrid donations={donations} onView={setSelectedDonation} /></section>}

          {activeTab === "Requests" && <section><SectionTitle title="Donation Requests" subtitle="Review requests from people in your community." /><RequestList requests={requests} onReview={setSelectedRequest} /></section>}

          {activeTab === "Account" && <section className="mx-auto max-w-2xl space-y-4">
            <SectionTitle title="Account" subtitle="Your profile and preferences in one place." />
            <div className={cardClass}>
              <div className="flex items-center gap-[10px] border-b border-[#E8EDE9] pb-[10px]"><div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#DDE9DF] font-bold text-[#2F5547]">{userName.charAt(0).toUpperCase()}</div><div><h3 className="font-semibold">{userName}</h3><p className="text-xs text-[#71817A]">Donator account</p></div></div>
              <div className="grid gap-[10px] py-3 sm:grid-cols-2"><ProfileField label="Name" value={user?.name || "Not available"} /><ProfileField label="Phone" value={user?.phone || "Not available"} /><ProfileField label="Email" value={user?.email || "Not available"} /><ProfileField label="City" value={user?.location?.city || "Not available"} /></div>
            </div>
            <div className={`${cardClass} space-y-1`}>
              <h3 className="mb-2 text-sm font-semibold">Notification preferences</h3>
              <ToggleRow title="Email notifications" description="Receive updates by email." checked={emailNotifications} onChange={setEmailNotifications} />
              <ToggleRow title="In-app notifications" description="Show updates in SAHARA." checked={appNotifications} onChange={setAppNotifications} />
            </div>
            <button onClick={logout} className="flex w-full items-center gap-2 rounded-[6px] border border-red-200 bg-white px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"><LogOut size={16} />Log out</button>
            <p className="text-xs text-[#8A9890]">Notification preferences currently apply to this page only and are not saved to the server.</p>
          </section>}
        </main>
      </div>

      {selectedDonation && <Modal title="Donation details" onClose={() => setSelectedDonation(null)}>
        <div className="flex flex-col gap-[14px] rounded-[10px] border border-[#E4EEE6] bg-gradient-to-br from-[#F0F7F1] to-[#F8FAF8] p-[14px] sm:flex-row sm:items-center sm:p-[18px]">
          <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-[10px] bg-white text-[#3F725E] shadow-sm"><Package size={28} /></div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-md bg-[#DCEFE1] px-2.5 py-1 text-xs font-semibold text-[#35664F]">{selectedDonation.type}</span><span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-[#35664F]">{selectedDonation.status}</span></div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#71877B]">Item name</p>
            <h4 className="mt-0.5 text-xl font-bold tracking-tight text-[#26332F]">{selectedDonation.title}</h4>
            <p className="mt-1 text-sm leading-6 text-[#71817A]">{selectedDonation.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[10px]"><InfoBox label="Category" value={selectedDonation.type} /><InfoBox label="Total quantity" value={selectedDonation.quantity} /><InfoBox label="Pickup location" value={selectedDonation.location || "Not provided"} /><InfoBox label="Requests received" value={String(selectedDonation.requests)} /><InfoBox label="Availability status" value={selectedDonation.status} /><InfoBox label="Donor" value={userName} /></div>
        <div className="grid gap-[10px] border-t border-[#E8EDE9] pt-4 sm:grid-cols-2">
          <div className="flex items-center gap-[10px] rounded-[10px] bg-[#F8FAF8] p-3.5"><span className="flex h-[38px] w-[38px] items-center justify-center rounded-[6px] bg-white text-[#3F725E]"><UserRound size={19} /></span><div><p className="text-xs text-[#849189]">Donor information</p><p className="mt-1 text-sm font-semibold text-[#26332F]">{userName}</p><p className="text-xs text-[#71817A]">Community donor</p></div></div>
          <div className="flex items-center gap-[10px] rounded-[10px] bg-[#F8FAF8] p-3.5"><span className="flex h-[38px] w-[38px] items-center justify-center rounded-[6px] bg-white text-[#3F725E]"><Clock size={19} /></span><div><p className="text-xs text-[#849189]">Donation status</p><p className="mt-1 text-sm font-semibold text-[#26332F]">{selectedDonation.status}</p><p className="text-xs text-[#71817A]">Available for community support</p></div></div>
        </div>
        <div className="flex justify-end"><button onClick={() => setSelectedDonation(null)} className="rounded-[6px] bg-[#3F725E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#315D4C]">Close</button></div>
      </Modal>}

      {selectedRequest && <Modal title="Review Request" onClose={() => setSelectedRequest(null)}>
        <p className="text-sm"> <strong>{selectedRequest.receiver}</strong> requested <strong>{selectedRequest.item}</strong>.</p><p className="text-xs text-[#71817A]">Date: {selectedRequest.date} · Status: {selectedRequest.status}</p>
        {selectedRequest.status === "Pending" ? <div className="flex gap-2"><button onClick={() => updateRequest(selectedRequest.id, "Approved")} className="rounded-[6px] bg-[#4F7C68] px-3 py-2 text-sm text-white"><Check size={15} className="mr-1 inline" />Approve</button><button onClick={() => updateRequest(selectedRequest.id, "Rejected")} className="rounded-[6px] border border-red-200 px-3 py-2 text-sm text-red-600"><XCircle size={15} className="mr-1 inline" />Reject</button></div> : <button onClick={() => setSelectedRequest(null)} className="rounded-[6px] border px-3 py-2 text-sm">Close</button>}
      </Modal>}
    </div>
  );
}

function SectionTitle({ title, subtitle, action, onAction }: { title: string; subtitle?: string; action?: string; onAction?: () => void }) {
  return <div className="mb-[10px] flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-xl font-bold">{title}</h2>{subtitle && <p className="mt-1 text-xs text-[#71817A]">{subtitle}</p>}</div>{action && <button onClick={onAction} className="text-xs font-semibold text-[#4F7C68]">{action} →</button>}</div>;
}

function DonationGrid({ donations, onView }: { donations: Donation[]; onView: (d: Donation) => void }) {
  if (!donations.length) return <div className="rounded-[10px] border bg-white p-[18px] text-sm text-[#71817A]">No donations yet.</div>;
  return <div className="max-h-[620px] overflow-y-auto overscroll-contain pr-2 [scrollbar-gutter:stable]"><div className="grid gap-[10px] md:grid-cols-2 xl:grid-cols-3">{donations.map((d) => <article key={d.id} className="rounded-[14px] border border-[#E0E7E1] bg-white p-[18px] shadow-[0_2px_8px_rgba(38,51,47,0.035)]"><div className="mb-[10px] flex items-center justify-between"><span className={`rounded-[6px] p-2 ${d.type === "Food" ? "bg-[#FFF2E9] text-[#C8794D]" : "bg-[#EDF5EF] text-[#4F7C68]"}`}>{d.type === "Food" ? <Utensils size={18} /> : <Shirt size={18} />}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${d.status === "Active" ? "bg-[#E5F3E8] text-[#397151]" : "bg-gray-100 text-gray-600"}`}>{d.status}</span></div><h3 className="font-semibold">{d.title}</h3><p className="mt-1 text-xs text-[#71817A]">{d.type} · {d.quantity}</p><p className="mt-2 line-clamp-2 text-xs text-[#71817A]">{d.description}</p><div className="mt-[10px] flex items-center justify-between border-t border-[#E8EDE9] pt-[10px] text-xs text-[#71817A]"><span>{d.requests} request(s)</span><button onClick={() => onView(d)} className="inline-flex items-center gap-1 font-semibold text-[#4F7C68]"><Eye size={14} />Details</button></div></article>)}</div></div>;
}

function RequestList({ requests, onReview }: { requests: DonationRequest[]; onReview: (r: DonationRequest) => void }) {
  if (!requests.length) return <div className="rounded-[10px] border bg-white p-[18px] text-sm text-[#71817A]">No requests found.</div>;
  return <div className="max-h-[390px] overflow-y-auto rounded-[14px] border border-[#E0E7E1] bg-white shadow-[0_2px_8px_rgba(38,51,47,0.035)]">{requests.map((r, i) => <div key={r.id} className={`flex min-h-[68px] flex-wrap items-center justify-between gap-[10px] px-3 py-2.5 ${i ? "border-t border-[#E8EDE9]" : ""}`}><div className="flex min-w-0 items-center gap-2.5"><span className="rounded-[6px] bg-[#EDF5EF] p-2 text-[#4F7C68]"><Package size={17} /></span><div className="min-w-0"><p className="truncate text-sm font-semibold">{r.item}</p><p className="text-xs text-[#71817A]">{r.receiver} · {r.date}</p></div></div><div className="flex items-center gap-2"><span className="text-[11px] text-[#71817A]">{r.status}</span><button onClick={() => onReview(r)} className="rounded-[6px] border border-[#D9E1DB] px-3 py-2 text-xs font-semibold text-[#52645A] transition hover:bg-[#F2F6F2]">Review</button></div></div>)}</div>;
}

function ToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <div className="flex items-center justify-between gap-[10px] border-t border-[#E8EDE9] py-2.5"><div><p className="text-sm font-medium">{title}</p><p className="mt-0.5 text-xs text-[#71817A]">{description}</p></div><button type="button" role="switch" aria-checked={checked} aria-label={title} onClick={() => onChange(!checked)} className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked ? "bg-[#4F7C68]" : "bg-gray-300"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${checked ? "left-[18px]" : "left-0.5"}`} /></button></div>;
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[6px] bg-[#F7F8F5] px-3 py-2"><p className="text-[10px] text-[#8A9890]">{label}</p><p className="mt-0.5 break-words text-sm font-medium">{value}</p></div>;
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[10px] border border-[#E8EDE9] bg-[#F8FAF8] p-3.5 transition hover:border-[#D4E3D8]"><p className="text-xs font-medium text-[#849189]">{label}</p><p className="mt-1.5 break-words text-sm font-semibold text-[#26332F]">{value}</p></div>;
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#18231F]/45 p-3 backdrop-blur-[3px] sm:p-6"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="my-auto flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[14px] border border-white/70 bg-white shadow-[0_24px_80px_rgba(19,39,30,0.24)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between gap-[14px] border-b border-[#E8EDE9] px-[18px] py-4 sm:px-[26px]">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#26332F] sm:text-2xl">{title}</h3>
            <p className="mt-1 text-sm text-[#7B8982]">Here’s all the information about this donation.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[6px] border border-[#E3E9E4] bg-[#F8FAF8] text-[#52645A] transition hover:bg-[#EAF2EC]"
          >
            <X size={19} />
          </button>
        </header>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-[18px] py-[18px] sm:px-[26px]">
          {children}
        </div>
      </section>
    </div>
  );
}
