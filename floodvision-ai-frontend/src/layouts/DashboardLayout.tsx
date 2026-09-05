import { useState } from "react";
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
  Activity,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cases", label: "Flood Cases", icon: FolderKanban },
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

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || "Response Officer";
  const displayRole = user?.role || "viewer";

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900">
      {/* Light Sidebar */}
      <aside
        className={`flex flex-col border-r border-slate-200 bg-white text-slate-700 transition-all duration-200 shadow-xs ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4 bg-white">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Waves size={20} strokeWidth={2.2} />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-display text-sm font-bold text-slate-900 tracking-tight">FloodVision AI</p>
              <p className="text-[11px] font-medium text-slate-500">Response Console</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/cases"}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} strokeWidth={2} className={`shrink-0 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"}`} />
                  {!collapsed && <span>{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3 bg-white">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!collapsed && <span className="text-xs font-semibold">Collapse Sidebar</span>}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <Activity size={13} className="text-emerald-600" />
              SYSTEM OPERATIONAL
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              title="Notifications"
              className="relative rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-2 pr-3 hover:bg-slate-100 hover:border-slate-300 transition-all"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-semibold text-xs text-blue-700">
                  {displayName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="text-left leading-tight">
                  <p className="text-sm font-semibold text-slate-800">{displayName}</p>
                  <p className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                    <ShieldCheck size={11} className="text-blue-600" />
                    {roleLabels[displayRole] || displayRole}
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <Settings size={15} className="text-slate-500" /> Profile Settings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 border-t border-slate-100 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
