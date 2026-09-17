import { Link } from "react-router-dom";
import { ExternalLink, Plus } from "lucide-react";

export default function AdminHeader({ title }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-5 py-3.5 md:px-8">
      <div>
        <h1 className="text-base sm:text-lg font-bold text-slate-900">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/admin/changelogs/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-brand-500/25 hover:bg-brand-700 transition"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Release</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
        >
          <span>Public Timeline</span>
          <ExternalLink className="h-3 w-3 text-slate-400" />
        </Link>
      </div>
    </div>
  );
}

