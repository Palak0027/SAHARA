import { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Clock3,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Package,
  Play,
  Settings,
  User,
  UserCheck,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import type { LucideIcon } from "lucide-react";

type Tab =
  | "Overview"
  | "Available Tasks"
  | "My Tasks"
  | "Messages"
  | "Impact"
  | "Profile"
  | "Settings";

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
  {
    id: 1,
    title: "Food Donation Pickup",
    description:
      "Collect grocery items from a donor and deliver them to a nearby receiver.",
    location: "Kakadeo, Kanpur",
    category: "Food",
    status: "Available",
    time: "Today · 4:00 PM",
    people: 1,
  },
  {
    id: 2,
    title: "Clothes Distribution",
    description:
      "Help distribute clean clothes to families registered with SAHARA.",
    location: "Swaroop Nagar, Kanpur",
    category: "Clothes",
    status: "Available",
    time: "Today · 5:30 PM",
    people: 2,
  },
  {
    id: 3,
    title: "Community Food Delivery",
    description:
      "Deliver prepared food packages to a nearby community.",
    location: "Arya Nagar, Kanpur",
    category: "Food",
    status: "Available",
    time: "Tomorrow · 11:00 AM",
    people: 3,
  },
  {
    id: 4,
    title: "Donation Sorting",
    description:
      "Sort donated clothes and food items before distribution.",
    location: "SAHARA Community Center",
    category: "Clothes",
    status: "Available",
    time: "Tomorrow · 2:00 PM",
    people: 2,
  },
  {
    id: 5,
    title: "Emergency Food Delivery",
    description:
      "Deliver an urgent food donation to a registered receiver.",
    location: "Kalyanpur, Kanpur",
    category: "Food",
    status: "In Progress",
    time: "Today · 6:00 PM",
    people: 1,
  },
];

export default function VolunteerDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] =
    useState<Tab>("Overview");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [tasks, setTasks] =
    useState<Task[]>(initialTasks);

  const availableTasks = useMemo(
    () =>
      tasks.filter(
        (task) => task.status === "Available"
      ),
    [tasks]
  );

  const myTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.status === "In Progress" ||
          task.status === "Completed"
      ),
    [tasks]
  );

  const activeTasks = useMemo(
    () =>
      tasks.filter(
        (task) => task.status === "In Progress"
      ),
    [tasks]
  );

  const completedTasks = useMemo(
    () =>
      tasks.filter(
        (task) => task.status === "Completed"
      ),
    [tasks]
  );

  const navigateTab = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    setShowNotifications(false);
  };

  const startTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, status: "In Progress" }
          : task
      )
    );
  };

  const completeTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, status: "Completed" }
          : task
      )
    );
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#26332F]">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[min(18rem,85vw)] flex-col border-r border-[#DDE6DF] bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-[#E6ECE8] px-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2F5547]">
              SAHARA
            </h1>

            <p className="mt-0.5 text-xs text-[#8A9891]">
              Volunteer Panel
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-[#71817A] hover:bg-[#F3F6F3] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User */}
        <div className="border-b border-[#E6ECE8] px-5 py-5">
          <div className="flex items-center gap-3 rounded-xl bg-[#F3F7F4] p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDEBE2] text-[#3E6856]">
              <UserCheck className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#26332F]">
                {user?.name || "SAHARA Volunteer"}
              </p>

              <p className="text-xs text-[#71817A]">
                Volunteer
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {nav.map((item) => {
            const Icon = item.icon;
            const active =
              activeTab === item.label;

            return (
              <button
                key={item.label}
                onClick={() =>
                  navigateTab(item.label)
                }
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "bg-[#E7F0E9] text-[#3E6856]"
                    : "text-[#65756D] hover:bg-[#F4F7F5] hover:text-[#3E6856]"
                }`}
              >
                <Icon className="h-5 w-5" />

                <span>{item.label}</span>

                {item.label === "Available Tasks" &&
                  availableTasks.length > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4F7C68] px-1.5 text-[10px] font-bold text-white">
                      {availableTasks.length}
                    </span>
                  )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-[#E6ECE8] p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#A05B5B] transition hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 lg:pl-72">

        {/* Header */}
        <header className="sticky top-0 z-30 flex min-w-0 h-20 items-center justify-between border-b border-[#DDE6DF] bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-[#4F655C] hover:bg-[#F3F6F3] lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div>
              <p className="text-xs font-medium text-[#8A9891]">
                Volunteer Dashboard
              </p>

              <h2 className="text-lg font-bold text-[#26332F]">
                {activeTab}
              </h2>
            </div>
          </div>

          {/* Notification */}
          <div className="relative">

            <button
              onClick={() =>
                setShowNotifications(
                  (current) => !current
                )
              }
              className="relative rounded-xl p-2.5 text-[#65756D] hover:bg-[#F3F6F3]"
            >
              <Bell className="h-5 w-5" />

              {availableTasks.length > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#C66B5B]" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 rounded-2xl border border-[#DDE6DF] bg-white p-4 shadow-xl">

                <div className="mb-3 flex items-center justify-between">

                  <h3 className="font-semibold text-[#26332F]">
                    Notifications
                  </h3>

                  <button
                    onClick={() =>
                      setShowNotifications(false)
                    }
                    className="text-[#8A9891]"
                  >
                    <X className="h-4 w-4" />
                  </button>

                </div>

                <div className="space-y-3">

                  <div className="rounded-xl bg-[#F3F7F4] p-3">
                    <p className="text-sm font-medium text-[#34453E]">
                      {availableTasks.length} new task
                      {availableTasks.length !== 1
                        ? "s"
                        : ""}{" "}
                      available.
                    </p>

                    <button
                      onClick={() =>
                        navigateTab(
                          "Available Tasks"
                        )
                      }
                      className="mt-2 text-xs font-semibold text-[#4F7C68]"
                    >
                      View tasks →
                    </button>
                  </div>

                  <div className="rounded-xl bg-[#E7F4E8] p-3">
                    <p className="text-sm text-[#176C62]">
                      {activeTasks.length} active task
                      {activeTasks.length !== 1
                        ? "s"
                        : ""}{" "}
                      assigned to you.
                    </p>
                  </div>

                </div>
              </div>
            )}
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">

          {/* =====================================================
              OVERVIEW
          ====================================================== */}

          {activeTab === "Overview" && (
            <div className="space-y-8">

              <div>
                <p className="text-sm font-medium text-[#4F7C68]">
                  Welcome back 👋
                </p>

                <h1 className="mt-1 text-2xl font-bold text-[#26332F] sm:text-3xl">
                  Ready to make an impact?
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-[#71817A]">
                  Help connect donations with people who
                  need them in your community.
                </p>
              </div>

              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <VolunteerStat
                  icon={ClipboardList}
                  value={availableTasks.length}
                  label="Available Tasks"
                />

                <VolunteerStat
                  icon={Clock3}
                  value={activeTasks.length}
                  label="Active Tasks"
                />

                <VolunteerStat
                  icon={CheckCircle}
                  value={completedTasks.length}
                  label="Completed Tasks"
                />

                <VolunteerStat
                  icon={HeartHandshake}
                  value={completedTasks.length * 3}
                  label="People Helped"
                />

              </div>

              {/* CTA */}
              <div className="rounded-3xl bg-[#365F4F] p-6 text-white sm:p-8">

                <div className="max-w-2xl">

                  <p className="text-sm font-medium text-[#D8E9DE]">
                    Community needs you
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Find a task and make someone's day better.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#D8E3DD]">
                    Pick up donations, deliver essentials or
                    help organize community resources.
                  </p>

                  <button
                    onClick={() =>
                      navigateTab(
                        "Available Tasks"
                      )
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#365F4F] transition hover:bg-[#F3F7F4]"
                  >
                    Find Tasks
                    <ChevronRight className="h-4 w-4" />
                  </button>

                </div>
              </div>

              {/* Available Tasks */}
              <div className="space-y-5">

                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="text-lg font-bold text-[#26332F]">
                      Available Tasks
                    </h3>

                    <p className="mt-1 text-sm text-[#8A9891]">
                      Tasks you can volunteer for.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigateTab(
                        "Available Tasks"
                      )
                    }
                    className="text-sm font-semibold text-[#4F7C68]"
                  >
                    View all
                  </button>

                </div>

                <TaskGrid
                  tasks={availableTasks.slice(0, 3)}
                  onStart={startTask}
                  onComplete={completeTask}
                />

              </div>
            </div>
          )}

          {/* =====================================================
              AVAILABLE TASKS
          ====================================================== */}

          {activeTab === "Available Tasks" && (
            <section className="space-y-6">

              <SectionHeading
                title="Available Tasks"
                description="Choose a community task that you would like to help with."
              />

              {availableTasks.length === 0 ? (
                <EmptyState
                  title="No tasks available"
                  description="There are currently no new tasks waiting for volunteers."
                />
              ) : (
                <TaskGrid
                  tasks={availableTasks}
                  onStart={startTask}
                  onComplete={completeTask}
                />
              )}

            </section>
          )}

          {/* =====================================================
              MY TASKS
          ====================================================== */}

          {activeTab === "My Tasks" && (
            <section className="space-y-6">

              <SectionHeading
                title="My Tasks"
                description="Track the tasks you have started and completed."
              />

              {myTasks.length === 0 ? (
                <EmptyState
                  title="No tasks yet"
                  description="Choose a task from Available Tasks to get started."
                />
              ) : (
                <div className="max-h-[540px] space-y-3 overflow-y-auto pr-1">
                  {myTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border border-[#DDE6DF] bg-white p-5"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E7F0E9] text-[#4F7C68]">
                            {task.category === "Food" ? (
                              <HeartHandshake className="h-5 w-5" />
                            ) : (
                              <Package className="h-5 w-5" />
                            )}
                          </div>

                          <div>
                            <h3 className="font-bold text-[#26332F]">
                              {task.title}
                            </h3>

                            <p className="mt-1 text-sm text-[#71817A]">
                              {task.location}
                            </p>

                            <p className="mt-2 text-xs text-[#8A9891]">
                              {task.time}
                            </p>
                          </div>

                        </div>

                        <div className="flex flex-wrap items-center gap-3">

                          <TaskStatusBadge
                            status={task.status}
                          />

                          {task.status ===
                            "In Progress" && (
                            <button
                              onClick={() =>
                                completeTask(task.id)
                              }
                              className="flex items-center gap-2 rounded-xl bg-[#4F7C68] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3E6856]"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Complete
                            </button>
                          )}

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </section>
          )}

          {/* =====================================================
              MESSAGES
          ====================================================== */}

          {activeTab === "Messages" && (
            <section className="space-y-6">

              <SectionHeading
                title="Messages"
                description="Stay connected with the SAHARA community."
              />

              <div className="rounded-2xl border border-[#DDE6DF] bg-white p-6">

                <div className="flex items-center gap-4 border-b border-[#E6ECE8] pb-5">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7F0E9] text-[#4F7C68]">
                    <MessageSquare className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-[#26332F]">
                      Community Coordination
                    </h3>

                    <p className="mt-1 text-sm text-[#8A9891]">
                      Messages and coordination updates will
                      appear here.
                    </p>
                  </div>

                </div>

                <div className="py-12 text-center">

                  <MessageSquare className="mx-auto h-10 w-10 text-[#C7D3CB]" />

                  <h3 className="mt-4 font-semibold text-[#52645B]">
                    No new messages
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm text-[#8A9891]">
                    You don't have any new community messages
                    right now.
                  </p>

                </div>

              </div>
            </section>
          )}

          {/* =====================================================
              IMPACT
          ====================================================== */}

          {activeTab === "Impact" && (
            <section className="space-y-6">

              <SectionHeading
                title="My Impact"
                description="See how your volunteer work is helping the community."
              />

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                <ImpactCard
                  icon={CheckCircle}
                  value={completedTasks.length}
                  label="Tasks Completed"
                />

                <ImpactCard
                  icon={HeartHandshake}
                  value={completedTasks.length * 3}
                  label="People Helped"
                />

                <ImpactCard
                  icon={Package}
                  value={completedTasks.length * 2}
                  label="Donations Delivered"
                />

              </div>

              <div className="rounded-2xl border border-[#DDE6DF] bg-white p-6 sm:p-8">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F0E9] text-[#4F7C68]">
                    <HeartHandshake className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-[#26332F]">
                      Thank you for volunteering 💚
                    </h3>

                    <p className="mt-1 text-sm text-[#8A9891]">
                      Every task you complete helps make
                      someone's life a little easier.
                    </p>
                  </div>

                </div>

              </div>

            </section>
          )}

          {/* =====================================================
              PROFILE
          ====================================================== */}

          {activeTab === "Profile" && (
            <section className="max-w-2xl space-y-6">

              <SectionHeading
                title="My Profile"
                description="View your volunteer account information."
              />

              <div className="rounded-2xl border border-[#DDE6DF] bg-white p-6 sm:p-8">

                <div className="mb-7 flex items-center gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DDEBE2] text-[#3E6856]">
                    <UserCheck className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#26332F]">
                      {user?.name ||
                        "SAHARA Volunteer"}
                    </h3>

                    <p className="text-sm text-[#71817A]">
                      Volunteer
                    </p>
                  </div>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <ProfileField
                    label="Name"
                    value={
                      user?.name ||
                      "SAHARA Volunteer"
                    }
                  />

                  <ProfileField
                    label="Phone"
                    value={
                      user?.phone ||
                      "Not available"
                    }
                  />

                  <ProfileField
                    label="Email"
                    value={
                      user?.email ||
                      "Not available"
                    }
                  />

                  <ProfileField
                    label="Role"
                    value="Volunteer"
                  />

                </div>

              </div>
            </section>
          )}

          {/* =====================================================
              SETTINGS
          ====================================================== */}

          {activeTab === "Settings" && (
            <section className="max-w-2xl space-y-6">

              <SectionHeading
                title="Settings"
                description="Manage your volunteer dashboard preferences."
              />

              <div className="space-y-4">

                <SettingRow
                  title="Task Notifications"
                  description="Receive alerts when new volunteer tasks become available."
                />

                <SettingRow
                  title="Task Reminders"
                  description="Receive reminders for tasks you have started."
                />

                <SettingRow
                  title="Community Messages"
                  description="Receive updates and coordination messages."
                />

              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

                <h3 className="font-semibold text-red-700">
                  Account Actions
                </h3>

                <p className="mt-1 text-sm text-red-600/80">
                  Sign out of your current volunteer session.
                </p>

                <button
                  onClick={handleLogout}
                  className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Logout
                </button>

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

function VolunteerStat({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F0E9] text-[#4F7C68]">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-5 text-2xl font-bold text-[#26332F]">
        {value}
      </p>

      <p className="mt-1 text-sm text-[#71817A]">
        {label}
      </p>

    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#26332F] sm:text-3xl">
        {title}
      </h1>

      <p className="mt-2 text-sm text-[#71817A]">
        {description}
      </p>
    </div>
  );
}

function TaskGrid({
  tasks,
  onStart,
  onComplete,
}: {
  tasks: Task[];
  onStart: (id: number) => void;
  onComplete: (id: number) => void;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex flex-col rounded-2xl border border-[#DDE6DF] bg-white p-5"
        >

          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F0E9] text-[#4F7C68]">
              {task.category === "Food" ? (
                <HeartHandshake className="h-5 w-5" />
              ) : (
                <Package className="h-5 w-5" />
              )}
            </div>

            <TaskStatusBadge
              status={task.status}
            />

          </div>

          <h3 className="mt-5 font-bold text-[#26332F]">
            {task.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#71817A]">
            {task.description}
          </p>

          <div className="mt-4 space-y-2">

            <div className="flex items-center gap-2 text-xs text-[#71817A]">
              <MapPin className="h-4 w-4 text-[#4F7C68]" />
              {task.location}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#71817A]">
              <Clock3 className="h-4 w-4 text-[#4F7C68]" />
              {task.time}
            </div>

          </div>

          <div className="mt-auto pt-5">

            {task.status === "Available" && (
              <button
                onClick={() =>
                  onStart(task.id)
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F7C68] py-3 text-sm font-semibold text-white transition hover:bg-[#3E6856]"
              >
                <Play className="h-4 w-4" />
                Start Task
              </button>
            )}

            {task.status === "In Progress" && (
              <button
                onClick={() =>
                  onComplete(task.id)
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#365F4F] py-3 text-sm font-semibold text-white transition hover:bg-[#2F5547]"
              >
                <CheckCircle className="h-4 w-4" />
                Complete Task
              </button>
            )}

            {task.status === "Completed" && (
              <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E7F3EA] py-3 text-sm font-semibold text-[#3E6856]">
                <CheckCircle className="h-4 w-4" />
                Completed
              </div>
            )}

          </div>
        </div>
      ))}

    </div>
  );
}

function TaskStatusBadge({
  status,
}: {
  status: TaskStatus;
}) {
  const styles = {
    Available:
      "bg-[#EEF4F0] text-[#4F7C68]",
    "In Progress":
      "bg-[#E7F4E8] text-[#176C62]",
    Completed:
      "bg-[#E7F3EA] text-[#3E6856]",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ImpactCard({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-[#DDE6DF] bg-white p-6">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F0E9] text-[#4F7C68]">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-5 text-3xl font-bold text-[#26332F]">
        {value}
      </p>

      <p className="mt-1 text-sm text-[#71817A]">
        {label}
      </p>

    </div>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8A9891]">
        {label}
      </p>

      <div className="rounded-xl border border-[#DDE6DF] bg-[#F8FAF8] px-4 py-3 text-sm text-[#34453E]">
        {value}
      </div>

    </div>
  );
}

function SettingRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [enabled, setEnabled] =
    useState(true);

  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-[#DDE6DF] bg-white p-5">

      <div>
        <h3 className="font-semibold text-[#34453E]">
          {title}
        </h3>

        <p className="mt-1 text-sm text-[#8A9891]">
          {description}
        </p>
      </div>

      <button
        onClick={() =>
          setEnabled(
            (current) => !current
          )
        }
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-[#4F7C68]"
            : "bg-[#C8D1CB]"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#DDE6DF] bg-white px-6 py-16 text-center">

      <ClipboardList className="mx-auto h-10 w-10 text-[#C7D3CB]" />

      <h3 className="mt-4 font-semibold text-[#52645B]">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-[#8A9891]">
        {description}
      </p>

    </div>
  );
}