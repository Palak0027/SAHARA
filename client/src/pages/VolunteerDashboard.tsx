import { useMemo, useState } from "react";
import {
  Bell, CheckCircle, ChevronRight, ClipboardList, Clock3, HeartHandshake, Inbox,
  LayoutDashboard, LogOut, MapPin, Menu, MessageSquare, Package, Play, Settings,
  Shirt, User, UserCheck, Users, Utensils, X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import logoImg from "../components/image/sahara-logo.jpeg";
import { useAuth } from "../context/AuthContext";
import ChangePasswordCard from "../components/common/ChangePasswordCard";
import "../styles/VolunreerDashboard.css";

type Tab = "Overview" | "Available Tasks" | "My Tasks" | "Messages" | "Impact" | "Profile" | "Settings";
type TaskStatus = "Available" | "In Progress" | "Completed";

type Task = {
  id: number;
  title: string;
  description: string;
  location: string;
  category: "Food" | "Clothes";
  status: TaskStatus;
  time: string;
  people: number;
};

const nav: { label: Tab; icon: LucideIcon }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Available Tasks", icon: ClipboardList },
  { label: "My Tasks", icon: Package },
  { label: "Messages", icon: MessageSquare },
  { label: "Impact", icon: HeartHandshake },
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
];

const initialTasks: Task[] = [
  { id: 1, title: "Food Donation Pickup", description: "Collect grocery items from a donor and deliver them to a nearby receiver.", location: "Kakadeo, Kanpur", category: "Food", status: "Available", time: "Today · 4:00 PM", people: 1 },
  { id: 2, title: "Clothes Distribution", description: "Help distribute clean clothes to families registered with SAHARA.", location: "Swaroop Nagar, Kanpur", category: "Clothes", status: "Available", time: "Today · 5:30 PM", people: 2 },
  { id: 3, title: "Community Food Delivery", description: "Deliver prepared food packages to a nearby community.", location: "Arya Nagar, Kanpur", category: "Food", status: "Available", time: "Tomorrow · 11:00 AM", people: 3 },
  { id: 4, title: "Donation Sorting", description: "Sort donated clothes and food items before distribution.", location: "SAHARA Community Center", category: "Clothes", status: "Available", time: "Tomorrow · 2:00 PM", people: 2 },
  { id: 5, title: "Emergency Food Delivery", description: "Deliver an urgent food donation to a registered receiver.", location: "Kalyanpur, Kanpur", category: "Food", status: "In Progress", time: "Today · 6:00 PM", people: 1 },
];

const MILESTONE = 5; // itne tasks complete karne par "Community Helper" milestone

export default function VolunteerDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const availableTasks = useMemo(() => tasks.filter((t) => t.status === "Available"), [tasks]);
  const myTasks = useMemo(() => tasks.filter((t) => t.status === "In Progress" || t.status === "Completed"), [tasks]);
  const activeTasks = useMemo(() => tasks.filter((t) => t.status === "In Progress"), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.status === "Completed"), [tasks]);

  const userName = user?.name || "SAHARA Volunteer";
  const firstName = userName.split(" ")[0];

  const navigateTab = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    setShowNotifications(false);
  };

  const startTask = (id: number) =>
    setTasks((current) => current.map((t) => (t.id === id ? { ...t, status: "In Progress" } : t)));

  const completeTask = (id: number) =>
    setTasks((current) => current.map((t) => (t.id === id ? { ...t, status: "Completed" } : t)));

  const handleLogout = () => logout();

  const peopleHelped = completedTasks.length * 3;
  const milestonePct = Math.min(100, Math.round((completedTasks.length / MILESTONE) * 100));

  return (
    <div className="vd">
      {sidebarOpen && <button aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} className="vd-overlay" />}

      <aside className={`vd-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="vd-brand">
          <div className="vd-brand-main">
            <img src={logoImg} alt="SAHARA logo" className="vd-logo" />
            <div>
              <h1 className="vd-brand-name">SAHARA</h1>
              <p className="vd-brand-tag">Volunteer Panel</p>
            </div>
          </div>
          <button className="vd-close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="vd-nav" aria-label="Volunteer">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.label} onClick={() => navigateTab(item.label)} className={`vd-nav-btn ${activeTab === item.label ? "is-active" : ""}`}>
                <Icon size={18} />
                {item.label}
                {item.label === "Available Tasks" && availableTasks.length > 0 && <span className="vd-nav-badge">{availableTasks.length}</span>}
              </button>
            );
          })}
        </nav>

        <div className="vd-user">
          <div className="vd-avatar"><UserCheck size={18} /></div>
          <div className="vd-user-info">
            <p className="vd-user-name">{userName}</p>
            <p className="vd-user-role">Volunteer</p>
          </div>
          <button onClick={handleLogout} className="vd-icon-btn-dark" title="Logout" aria-label="Logout"><LogOut size={17} /></button>
        </div>
      </aside>

      <div className="vd-shell">
        <header className="vd-header">
          <div className="vd-header-left">
            <button onClick={() => setSidebarOpen(true)} className="vd-icon-btn vd-menu-btn" aria-label="Open menu"><Menu size={19} /></button>
            <div>
               
              <h2 className="vd-header-title">{activeTab}</h2>
            </div>
          </div>

          <div className="vd-notif-wrap">
            <button onClick={() => setShowNotifications((c) => !c)} aria-label="Notifications" className="vd-icon-btn">
              <Bell size={18} />
              {availableTasks.length > 0 && <span className="vd-dot" />}
            </button>
            {showNotifications && (
              <>
                <button className="vd-notif-backdrop" aria-label="Close notifications" onClick={() => setShowNotifications(false)} />
                <div className="vd-notif">
                  <strong>Notifications</strong>
                  <div className="vd-notif-item">
                    {availableTasks.length} new task{availableTasks.length !== 1 ? "s" : ""} available.
                    <br />
                    <button onClick={() => navigateTab("Available Tasks")} className="vd-link-btn">View tasks</button>
                  </div>
                  <div className="vd-notif-item is-green">
                    {activeTasks.length} active task{activeTasks.length !== 1 ? "s" : ""} assigned to you.
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="vd-main">
          {activeTab === "Overview" && (
            <>
              <section className="vd-hero">
                <div className="vd-hero-copy">
                  <h1 className="vd-hero-title">Namaste, {firstName}. Ready to make an impact?</h1>
                  <p className="vd-hero-text">Help connect donations with people who need them in your community. Pick up, deliver or sort, every task counts.</p>
                  <div className="vd-hero-actions">
                    <button onClick={() => navigateTab("Available Tasks")} className="vd-btn vd-btn-ghost">Find tasks<ChevronRight size={16} /></button>
                    <button onClick={() => navigateTab("My Tasks")} className="vd-btn vd-btn-ghost">My tasks</button>
                  </div>
                </div>
                <div className="vd-hero-stat">
                  <span className="vd-hero-num">{availableTasks.length}</span>
                  <span className="vd-hero-label">tasks waiting for a volunteer</span>
                </div>
              </section>

              <section className="vd-stats">
                <VolunteerStat icon={ClipboardList} value={availableTasks.length} label="Available tasks" />
                <VolunteerStat icon={Clock3} value={activeTasks.length} label="Active tasks" tone="vd-stat--pending" />
                <VolunteerStat icon={CheckCircle} value={completedTasks.length} label="Completed tasks" tone="vd-stat--done" />
                <VolunteerStat icon={HeartHandshake} value={peopleHelped} label="People helped" tone="vd-stat--people" />
              </section>

              <section>
                <SectionTitle title="Available tasks" subtitle="Tasks you can volunteer for" action="View all" onAction={() => navigateTab("Available Tasks")} />
                {availableTasks.length === 0
                  ? <EmptyState title="No tasks available" description="There are currently no new tasks waiting for volunteers." />
                  : <TaskGrid tasks={availableTasks.slice(0, 3)} onStart={startTask} onComplete={completeTask} />}
              </section>
            </>
          )}

          {activeTab === "Available Tasks" && (
            <section>
              <SectionTitle title="Available tasks" subtitle="Choose a community task that you would like to help with." />
              {availableTasks.length === 0
                ? <EmptyState title="No tasks available" description="There are currently no new tasks waiting for volunteers." />
                : <TaskGrid tasks={availableTasks} onStart={startTask} onComplete={completeTask} />}
            </section>
          )}

          {activeTab === "My Tasks" && (
            <section>
              <SectionTitle title="My tasks" subtitle="Track the tasks you have started and completed." />
              {myTasks.length === 0 ? (
                <EmptyState title="No tasks yet" description="Choose a task from Available Tasks to get started." />
              ) : (
                <div className="vd-list">
                  {myTasks.map((task) => {
                    const { Icon } = categoryMeta(task.category);
                    return (
                      <div key={task.id} className="vd-row">
                        <div className="vd-row-main">
                          <span className="vd-row-avatar"><Icon size={18} /></span>
                          <div style={{ minWidth: 0 }}>
                            <p className="vd-row-title">{task.title}</p>
                            <p className="vd-row-sub">{task.location}, {task.time}</p>
                          </div>
                        </div>
                        <div className="vd-row-side">
                          <TaskStatusBadge status={task.status} />
                          {task.status === "In Progress" && (
                            <button onClick={() => completeTask(task.id)} className="vd-btn vd-btn-primary vd-btn-sm"><CheckCircle size={15} />Complete</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {activeTab === "Messages" && (
            <section>
              <SectionTitle title="Messages" subtitle="Stay connected with the SAHARA community." />
              <div className="vd-card">
                <div className="vd-profile-head">
                  <span className="vd-type-icon"><MessageSquare size={20} /></span>
                  <div>
                    <h3 className="vd-profile-name">Community coordination</h3>
                    <p className="vd-profile-role">Messages and coordination updates will appear here.</p>
                  </div>
                </div>
                <div className="vd-empty" style={{ marginTop: 16, border: 0, background: "transparent" }}>
                  <span className="vd-empty-icon"><MessageSquare size={22} /></span>
                  <p><strong>No new messages</strong></p>
                  <p>You do not have any new community messages right now.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === "Impact" && (
            <section className="vd-stack">
              <SectionTitle title="My impact" subtitle="See how your volunteer work is helping the community." />
              <div className="vd-impact-grid">
                <VolunteerStat icon={CheckCircle} value={completedTasks.length} label="Tasks completed" tone="vd-stat--done" />
                <VolunteerStat icon={HeartHandshake} value={peopleHelped} label="People helped" tone="vd-stat--people" />
                <VolunteerStat icon={Package} value={completedTasks.length * 2} label="Donations delivered" />
              </div>

              <div className="vd-card">
                <div className="vd-milestone-head">
                  <h3 className="vd-card-title">Community Helper milestone</h3>
                  <span className="vd-pill vd-pill--Completed">{Math.min(completedTasks.length, MILESTONE)} / {MILESTONE}</span>
                </div>
                <p className="vd-note">
                  {completedTasks.length >= MILESTONE
                    ? "Milestone reached. Thank you for showing up for your community!"
                    : `Complete ${MILESTONE - completedTasks.length} more task${MILESTONE - completedTasks.length !== 1 ? "s" : ""} to reach this milestone.`}
                </p>
                <div className="vd-progress" role="progressbar" aria-valuenow={milestonePct} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${milestonePct}%` }} /></div>
              </div>

              <div className="vd-card vd-thanks">
                <span className="vd-type-icon"><HeartHandshake size={20} /></span>
                <div>
                  <h3 className="vd-profile-name">Thank you for volunteering</h3>
                  <p className="vd-profile-role">Every task you complete helps make someone's life a little easier.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === "Profile" && (
            <section className="vd-narrow vd-stack">
              <SectionTitle title="My profile" subtitle="View your volunteer account information." />
              <div className="vd-card">
                <div className="vd-profile-head">
                  <div className="vd-avatar"><UserCheck size={22} /></div>
                  <div>
                    <h3 className="vd-profile-name">{userName}</h3>
                    <p className="vd-profile-role">Volunteer</p>
                  </div>
                </div>
                <div className="vd-fields">
                  <ProfileField label="Name" value={userName} />
                  <ProfileField label="Phone" value={user?.phone || "Not available"} />
                  <ProfileField label="Email" value={user?.email || "Not available"} />
                  <ProfileField label="Role" value="Volunteer" />
                </div>
              </div>
            </section>
          )}

          {activeTab === "Settings" && (
            <section className="vd-narrow vd-stack">
              <SectionTitle title="Settings" subtitle="Manage your volunteer dashboard preferences." />
              <div className="vd-card vd-card--flush">
                <SettingRow title="Task notifications" description="Receive alerts when new volunteer tasks become available." />
                <SettingRow title="Task reminders" description="Receive reminders for tasks you have started." />
                <SettingRow title="Community messages" description="Receive updates and coordination messages." />
              </div>
              <p className="vd-note">Preferences currently apply to this page only and are not saved to the server.</p>

              {/* Change Password Card */}
              <ChangePasswordCard title="Volunteer Password & Security" subtitle="Update your password for your volunteer account." />

              <div className="vd-danger-card">
                <h3>Account actions</h3>
                <p>Sign out of your current volunteer session.</p>
                <button onClick={handleLogout} className="vd-btn vd-btn-red"><LogOut size={16} />Logout</button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   LOCAL UI HELPERS
========================================================= */

const categoryMeta = (category: Task["category"]) =>
  category === "Food" ? { Icon: Utensils, tone: "" } : { Icon: Shirt, tone: "vd-donation--clothes" };

function VolunteerStat({ icon: Icon, value, label, tone = "" }: { icon: LucideIcon; value: number; label: string; tone?: string }) {
  return (
    <div className={`vd-stat ${tone}`}>
      <div className="vd-stat-icon"><Icon size={19} /></div>
      <p className="vd-stat-value">{value}</p>
      <p className="vd-stat-label">{label}</p>
    </div>
  );
}

function SectionTitle({ title, subtitle, action, onAction }: { title: string; subtitle?: string; action?: string; onAction?: () => void }) {
  return (
    <div className="vd-section-head">
      <div>
        <h2 className="vd-section-title">{title}</h2>
        {subtitle && <p className="vd-section-sub">{subtitle}</p>}
      </div>
      {action && <button onClick={onAction} className="vd-link-btn">{action}</button>}
    </div>
  );
}

function TaskGrid({ tasks, onStart, onComplete }: { tasks: Task[]; onStart: (id: number) => void; onComplete: (id: number) => void }) {
  return (
    <div className="vd-grid">
      {tasks.map((task) => {
        const { Icon, tone } = categoryMeta(task.category);
        return (
          <article key={task.id} className={`vd-donation ${tone}`}>
            <div className="vd-donation-top">
              <span className="vd-type-icon"><Icon size={19} /></span>
              <TaskStatusBadge status={task.status} />
            </div>
            <h3 className="vd-donation-title">{task.title}</h3>
            <p className="vd-donation-meta">{task.category} task</p>
            <p className="vd-donation-desc">{task.description}</p>
            <div className="vd-task-meta">
              <span><MapPin size={15} />{task.location}</span>
              <span><Clock3 size={15} />{task.time}</span>
              <span><Users size={15} />{task.people} volunteer{task.people !== 1 ? "s" : ""} needed</span>
            </div>
            <div className="vd-task-actions">
              {task.status === "Available" && (
                <button onClick={() => onStart(task.id)} className="vd-btn vd-btn-primary vd-btn-full"><Play size={15} />Start task</button>
              )}
              {task.status === "In Progress" && (
                <button onClick={() => onComplete(task.id)} className="vd-btn vd-btn-dark vd-btn-full"><CheckCircle size={15} />Complete task</button>
              )}
              {task.status === "Completed" && (
                <div className="vd-done-badge"><CheckCircle size={16} />Completed</div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <span className={`vd-pill vd-pill--${status.replace(" ", "")}`}>{status}</span>;
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="vd-field">
      <p className="vd-field-label">{label}</p>
      <p className="vd-field-value">{value}</p>
    </div>
  );
}

function SettingRow({ title, description }: { title: string; description: string }) {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="vd-toggle-row">
      <div>
        <p className="vd-toggle-title">{title}</p>
        <p className="vd-toggle-desc">{description}</p>
      </div>
      <button type="button" role="switch" aria-checked={enabled} aria-label={`Toggle ${title}`} onClick={() => setEnabled((c) => !c)} className="vd-switch" />
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="vd-empty">
      <span className="vd-empty-icon"><Inbox size={22} /></span>
      <p><strong>{title}</strong></p>
      <p>{description}</p>
    </div>
  );
}