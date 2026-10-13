 import logoImg from '../components/image/sahara-logo.jpeg';
import { useState } from "react";
import {
  Bell, ChevronDown, Heart, HeartHandshake, Home, Package, Plus,
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

  const [form, setForm] = useState({ type: "Food" as "Food" | "Clothes", title: "", description: "", quantity: "" });
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
    if (!form.title.trim() || !form.description.trim() || !form.quantity.trim()) return;

    setDonations((prev) => [{
      id: Date.now(),
      ...form,
      requests: 0,
      status: "Active",
    }, ...prev]);

    setForm({ type: "Food", title: "", description: "", quantity: "" });
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

  const inputClass = "w-full rounded-lg border border-[#D9E1DB] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F7C68] focus:ring-2 focus:ring-[#E5F0E8]";
  const cardClass = "rounded-xl border border-[#DDE6DF] bg-white p-4";

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#26332F]">
      {sidebarOpen && <button aria-label="Close menu overlay" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/30 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-[#DDE5DF] bg-[#FAF8F3] transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-[#E3E9E4] px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5547] text-white">
              <img
            src={logoImg}
            alt=""
            className="h-11 w-11 shrink-0 rounded-full bg-white object-contain ring-1 ring-[#DCE6E1]"
          />
            </div>
            <div><h1 className="text-xl font-bold text-[#2F5547]">SAHARA</h1><p className="text-[10px] text-[#71817A]">Community Care</p></div>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={19} /></button>
        </div>

        <nav className="flex-3 space-y-1 overflow-y-auto p-3">
          <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-[#9AA8A0]">Dashboard</p>
          {navigation.map((item) => (
            <button key={item.name} onClick={() => navigateTab(item.name)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${activeTab === item.name ? "bg-[#E5F0E8] text-[#2F5547]" : "text-[#71817A] hover:bg-white hover:text-[#2F5547]"}`}>
              {item.icon}{item.name}
            </button>
          ))}
        </nav>

        <div className="border-t border-[#E3E9E4] p-3">
          <div className="flex items-center gap-2 rounded-lg bg-white p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDE9DF] text-sm font-bold text-[#2F5547]">{userName.charAt(0).toUpperCase()}</div>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{userName}</p><p className="text-xs text-[#8A9890]">Donator</p></div>
            <button onClick={logout} className="rounded-md p-1.5 text-[#8A9890] hover:bg-red-50 hover:text-red-600" title="Logout"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-30 flex h-26 items-center justify-between border-b border-[#E1E7E2] bg-[#F7F8F5]/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg border bg-white p-2 lg:hidden" aria-label="Open menu"><Menu size={19} /></button>
            <div><p className="text-[11px] text-[#8A9890]">Donator Dashboard</p><h2 className="text-base font-bold sm:text-lg">Welcome back, {userName.split(" ")[0]} 👋</h2></div>
          </div>
          <div className="relative">
            <button onClick={() => setShowNotifications((v) => !v)} aria-label="Notifications" className="relative rounded-lg border border-[#D9E1DB] bg-white p-2 text-[#607068]"><Bell size={18} />{pendingRequests > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#4F7C68]" />}</button>
            {showNotifications && <div className="absolute right-0 top-11 z-50 w-64 rounded-xl border bg-white p-3 shadow-lg"><p className="text-sm font-semibold">Notifications</p><p className="mt-1 text-xs text-[#71817A]">You have {pendingRequests} pending donation request{pendingRequests !== 1 ? "s" : ""}.</p></div>}
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
          {activeTab === "Overview" && <>
            <section className="flex flex-wrap items-center justify-between gap-3">
              <div><h1 className="text-2xl font-bold">Your Impact</h1><p className="mt-1 text-sm text-[#71817A]">Share what you can with your community.</p></div>
              <button onClick={() => navigateTab("Post Donation")} className="inline-flex items-center gap-2 rounded-lg bg-[#4F7C68] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3E6856]"><Plus size={16} /> Post Donation</button>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total donations", value: donations.length, icon: <Package size={19} /> },
                { label: "People reached", value: totalPeopleReached, icon: <Users size={19} /> },
                { label: "Completed donations", value: completedDonations, icon: <CheckCircle2 size={19} /> },
                { label: "Pending requests", value: pendingRequests, icon: <Clock size={19} /> },
              ].map((stat) => <div key={stat.label} className={cardClass}><div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#EDF5EF] text-[#4F7C68]">{stat.icon}</div><p className="text-2xl font-bold">{stat.value}</p><p className="mt-1 text-xs text-[#71817A]">{stat.label}</p></div>)}
            </section>

            <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#2F5547] p-4 text-white">
              <div className="flex items-center gap-3"><Heart size={23} /><div><h3 className="font-semibold">Have something to give?</h3><p className="text-xs text-[#C8D9CE]">Help someone nearby with useful items.</p></div></div>
              <button onClick={() => navigateTab("Post Donation")} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#2F5547]"><Plus size={15} className="mr-1 inline" />Create Donation</button>
            </section>

            <section><SectionTitle title="My Donations" subtitle="Your recent activity" action="View all" onAction={() => navigateTab("My Donations")} /><DonationGrid donations={donations.slice(0, 3)} onView={setSelectedDonation} /></section>
            <section><SectionTitle title="Donation Requests" subtitle="Requests from your community" action="View all" onAction={() => navigateTab("Requests")} /><RequestList requests={requests.slice(0, 3)} onReview={setSelectedRequest} /></section>
          </>}

          {activeTab === "Post Donation" && <section className="mx-auto max-w-2xl"><SectionTitle title="Post a Donation" subtitle="Add the details of the item you want to share." /><form onSubmit={handlePostDonation} className={`${cardClass} space-y-4`}>
            <div><label className="mb-1.5 block text-sm font-medium">Donation type</label><div className="grid grid-cols-2 gap-2">{(["Food", "Clothes"] as const).map((type) => <button key={type} type="button" onClick={() => setForm({ ...form, type })} className={`rounded-lg border px-3 py-2.5 text-sm ${form.type === type ? "border-[#4F7C68] bg-[#EDF5EF] text-[#2F5547]" : "border-[#D9E1DB]"}`}>{type === "Food" ? "🍱 Food" : "👕 Clothes"}</button>)}</div></div>
            <div><label className="mb-1.5 block text-sm font-medium">Donation title</label><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Grocery Essentials" required /></div>
            <div><label className="mb-1.5 block text-sm font-medium">Description</label><textarea className={inputClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your donation..." required /></div>
            <div><label className="mb-1.5 block text-sm font-medium">Quantity</label><input className={inputClass} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 5 items / 10 meals" required /></div>
            <div className="flex gap-2"><button className="rounded-lg bg-[#4F7C68] px-4 py-2.5 text-sm font-semibold text-white">Publish Donation</button><button type="button" onClick={() => navigateTab("Overview")} className="rounded-lg border px-4 py-2.5 text-sm">Cancel</button></div>
          </form></section>}

          {activeTab === "My Donations" && <section><SectionTitle title="My Donations" subtitle="Manage the donations you have posted." /><DonationGrid donations={donations} onView={setSelectedDonation} /></section>}

          {activeTab === "Requests" && <section><SectionTitle title="Donation Requests" subtitle="Review requests from people in your community." /><RequestList requests={requests} onReview={setSelectedRequest} /></section>}

          {activeTab === "Account" && <section className="mx-auto max-w-2xl space-y-4">
            <SectionTitle title="Account" subtitle="Your profile and preferences in one place." />
            <div className={cardClass}>
              <div className="flex items-center gap-3 border-b border-[#E8EDE9] pb-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDE9DF] font-bold text-[#2F5547]">{userName.charAt(0).toUpperCase()}</div><div><h3 className="font-semibold">{userName}</h3><p className="text-xs text-[#71817A]">Donator account</p></div></div>
              <div className="grid gap-3 py-3 sm:grid-cols-2"><ProfileField label="Name" value={user?.name || "Not available"} /><ProfileField label="Phone" value={user?.phone || "Not available"} /><ProfileField label="Email" value={user?.email || "Not available"} /><ProfileField label="City" value={user?.location?.city || "Not available"} /></div>
            </div>
            <div className={`${cardClass} space-y-1`}>
              <h3 className="mb-2 text-sm font-semibold">Notification preferences</h3>
              <ToggleRow title="Email notifications" description="Receive updates by email." checked={emailNotifications} onChange={setEmailNotifications} />
              <ToggleRow title="In-app notifications" description="Show updates in SAHARA." checked={appNotifications} onChange={setAppNotifications} />
            </div>
            <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"><LogOut size={16} />Log out</button>
            <p className="text-xs text-[#8A9890]">Notification preferences currently apply to this page only and are not saved to the server.</p>
          </section>}
        </main>
      </div>

      {selectedDonation && <Modal title={selectedDonation.title} onClose={() => setSelectedDonation(null)}>
        <p className="text-sm text-[#71817A]">{selectedDonation.description}</p><div className="grid grid-cols-2 gap-2"><InfoBox label="Type" value={selectedDonation.type} /><InfoBox label="Quantity" value={selectedDonation.quantity} /><InfoBox label="Requests" value={String(selectedDonation.requests)} /><InfoBox label="Status" value={selectedDonation.status} /></div><button onClick={() => setSelectedDonation(null)} className="rounded-lg bg-[#4F7C68] px-3 py-2 text-sm text-white">Close</button>
      </Modal>}

      {selectedRequest && <Modal title="Review Request" onClose={() => setSelectedRequest(null)}>
        <p className="text-sm"> <strong>{selectedRequest.receiver}</strong> requested <strong>{selectedRequest.item}</strong>.</p><p className="text-xs text-[#71817A]">Date: {selectedRequest.date} · Status: {selectedRequest.status}</p>
        {selectedRequest.status === "Pending" ? <div className="flex gap-2"><button onClick={() => updateRequest(selectedRequest.id, "Approved")} className="rounded-lg bg-[#4F7C68] px-3 py-2 text-sm text-white"><Check size={15} className="mr-1 inline" />Approve</button><button onClick={() => updateRequest(selectedRequest.id, "Rejected")} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"><XCircle size={15} className="mr-1 inline" />Reject</button></div> : <button onClick={() => setSelectedRequest(null)} className="rounded-lg border px-3 py-2 text-sm">Close</button>}
      </Modal>}
    </div>
  );
}

function SectionTitle({ title, subtitle, action, onAction }: { title: string; subtitle?: string; action?: string; onAction?: () => void }) {
  return <div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-xl font-bold">{title}</h2>{subtitle && <p className="mt-1 text-xs text-[#71817A]">{subtitle}</p>}</div>{action && <button onClick={onAction} className="text-xs font-semibold text-[#4F7C68]">{action} →</button>}</div>;
}

function DonationGrid({ donations, onView }: { donations: Donation[]; onView: (d: Donation) => void }) {
  if (!donations.length) return <div className="rounded-xl border bg-white p-5 text-sm text-[#71817A]">No donations yet.</div>;
  return <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{donations.map((d) => <article key={d.id} className="rounded-xl border border-[#DDE6DF] bg-white p-4"><div className="mb-3 flex items-center justify-between"><span className={`rounded-lg p-2 ${d.type === "Food" ? "bg-[#FFF2E9] text-[#C8794D]" : "bg-[#EDF5EF] text-[#4F7C68]"}`}>{d.type === "Food" ? <Utensils size={18} /> : <Shirt size={18} />}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${d.status === "Active" ? "bg-[#E5F3E8] text-[#397151]" : "bg-gray-100 text-gray-600"}`}>{d.status}</span></div><h3 className="font-semibold">{d.title}</h3><p className="mt-1 text-xs text-[#71817A]">{d.type} · {d.quantity}</p><p className="mt-2 line-clamp-2 text-xs text-[#71817A]">{d.description}</p><div className="mt-3 flex items-center justify-between border-t border-[#E8EDE9] pt-3 text-xs text-[#71817A]"><span>{d.requests} request(s)</span><button onClick={() => onView(d)} className="inline-flex items-center gap-1 font-semibold text-[#4F7C68]"><Eye size={14} />Details</button></div></article>)}</div>;
}

function RequestList({ requests, onReview }: { requests: DonationRequest[]; onReview: (r: DonationRequest) => void }) {
  if (!requests.length) return <div className="rounded-xl border bg-white p-5 text-sm text-[#71817A]">No requests found.</div>;
  return <div className="overflow-hidden rounded-xl border border-[#DDE6DF] bg-white">{requests.map((r, i) => <div key={r.id} className={`flex flex-wrap items-center justify-between gap-3 px-3 py-3 ${i ? "border-t border-[#E8EDE9]" : ""}`}><div className="flex min-w-0 items-center gap-2.5"><span className="rounded-lg bg-[#EDF5EF] p-2 text-[#4F7C68]"><Package size={17} /></span><div className="min-w-0"><p className="truncate text-sm font-semibold">{r.item}</p><p className="text-xs text-[#71817A]">{r.receiver} · {r.date}</p></div></div><div className="flex items-center gap-2"><span className="text-[11px] text-[#71817A]">{r.status}</span><button onClick={() => onReview(r)} className="rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-[#F7F8F5]">Review</button></div></div>)}</div>;
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
