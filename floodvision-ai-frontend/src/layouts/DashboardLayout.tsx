import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  FilePlus2,
  MapPinned,
  ListOrdered,
  FileBarChart,
  Waves,
  ChevronsLeft,
  ChevronsRight,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { currentUser } from "../data/mockData";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cases", label: "Cases", icon: FolderKanban },
  { to: "/cases/new", label: "Create Case", icon: FilePlus2 },
  { to: "/map", label: "Interactive Map", icon: MapPinned },
  { to: "/priority", label: "Rescue Priority", icon: ListOrdered },
  { to: "/reports", label: "Reports", icon: FileBarChart },
];

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  officer: "Response Officer",
  analyst: "Analyst",
  viewer: "Viewer",
};

function TelemetryClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="font-mono text-xs text-slate-400 tabular">
      {now.toISOString().slice(0, 19).replace("T", " ")} UTC
    </span>
  );
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full bg-ink-900 bg-grid bg-grid text-slate-100">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-ink-700 bg-ink-850/95 backdrop-blur transition-all duration-200 ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-ink-700 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-flood-500/15 text-flood-400">
            <Waves size={20} strokeWidth={2.2} />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold text-slate-100">FloodVision AI</p>
              <p className="text-[11px] text-slate-500">Response Console</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/cases"}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-flood-500/10 text-flood-300"
                    : "text-slate-400 hover:bg-ink-700/60 hover:text-slate-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-flood-400 transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <item.icon size={18} strokeWidth={2} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-700 p-3">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-slate-400 hover:bg-ink-700/60 hover:text-slate-100"
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-ink-700 bg-ink-850/80 px-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-flood-400" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-flood-400" />
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              System Nominal
            </span>
            <span className="mx-1 h-4 w-px bg-ink-600" />
            <TelemetryClock />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative rounded-lg p-2 text-slate-400 hover:bg-ink-700/60 hover:text-slate-100">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-crimson-500" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2.5 rounded-lg border border-ink-700 bg-ink-800 py-1.5 pl-1.5 pr-3 hover:border-ink-600"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-flood-500/15 text-sm font-semibold text-flood-300">
                  {currentUser.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="text-left leading-tight">
                  <p className="text-sm font-medium text-slate-100">{currentUser.name}</p>
                  <p className="flex items-center gap-1 text-[11px] text-slate-500">
                    <ShieldCheck size={11} className="text-flood-400" />
                    {roleLabels[currentUser.role]}
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-ink-700 bg-ink-800 shadow-panel">
                  <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-ink-700/60">
                    <Settings size={15} /> Profile Settings
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex w-full items-center gap-2.5 border-t border-ink-700 px-4 py-2.5 text-sm text-crimson-400 hover:bg-ink-700/60"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
