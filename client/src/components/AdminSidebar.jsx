import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, FileText, PlusCircle, ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/changelogs", label: "All Changelogs", icon: FileText },
  { to: "/admin/changelogs/new", label: "New Changelog", icon: PlusCircle },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-slate-200/80 bg-white p-5 md:flex">
      <div>
        {/* Brand header */}
        <div className="mb-6 flex items-center gap-2.5 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <ShieldCheck className="h-4.5 w-4.5 text-brand-300" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-none">Admin Studio</h2>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Publish & Manage</p>
          </div>
        </div>

        {/* Nav list */}
        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-bold border border-brand-200/60 shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Return to public timeline */}
      <div className="pt-4 border-t border-slate-100">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>View Public Timeline</span>
        </Link>
      </div>
    </aside>
  );
}

