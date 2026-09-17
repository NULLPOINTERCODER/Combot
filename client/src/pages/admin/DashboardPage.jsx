import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { changelogService } from "../../services/changelogService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import CategoryBadge from "../../components/CategoryBadge.jsx";
import { formatDate } from "../../utils/formatDate.js";
import { FileText, CheckCircle2, Clock, Plus, ArrowRight, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    changelogService.adminList({ page: 1, limit: 5 }).then((res) => {
      setStats(res.data.stats);
      setRecent(res.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;

  const cards = [
    {
      label: "Total Releases",
      value: stats?.total || 0,
      icon: FileText,
      bg: "bg-brand-50",
      color: "text-brand-600",
      border: "border-brand-200/60",
    },
    {
      label: "Published & Live",
      value: stats?.publishedCount || 0,
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
      border: "border-emerald-200/60",
    },
    {
      label: "Drafts (Unpublished)",
      value: stats?.draftCount || 0,
      icon: Clock,
      bg: "bg-amber-50",
      color: "text-amber-600",
      border: "border-amber-200/60",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft hover:shadow-cardHover transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.label}</p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">{c.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.bg} ${c.color} border ${c.border}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent updates section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-soft overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Changelog Entries</h2>
            <p className="text-xs text-slate-500 mt-0.5">Latest published or drafted product notes</p>
          </div>
          <Link
            to="/admin/changelogs"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No changelogs found. Create your first release note!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recent.map((c) => (
              <Link
                key={c._id}
                to={`/admin/changelogs/${c._id}/edit`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 hover:bg-slate-50/80 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CategoryBadge category={c.category} />
                  <span className="truncate text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {c.title}
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <StatusBadge status={c.status} />
                  <span className="text-xs font-medium text-slate-400">{formatDate(c.createdAt)}</span>
                  <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-brand-600 hidden sm:block" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

