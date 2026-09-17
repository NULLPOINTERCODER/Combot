import { useEffect, useState, useCallback } from "react";
import CategoryFilter from "../components/CategoryFilter.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ChangelogTimeline from "../components/ChangelogTimeline.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorState from "../components/ErrorState.jsx";
import Pagination from "../components/Pagination.jsx";
import { changelogService } from "../services/changelogService.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { Sparkles, Rss, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);

  const [changelogs, setChangelogs] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = debouncedSearch
        ? await changelogService.search(debouncedSearch, { page })
        : await changelogService.list({ category, page });
      setChangelogs(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load changelogs.");
    } finally {
      setLoading(false);
    }
  }, [category, debouncedSearch, page]);

  useEffect(() => {
    setPage(1);
  }, [category, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/50 p-6 sm:p-10 shadow-soft text-center sm:text-left">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            {/* Pill */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50/80 px-3 py-1 text-xs font-semibold text-brand-700 mb-4 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-brand-600" />
              <span>Product Updates & Release Notes</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Everything new, improved <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">
                and fixed in real-time.
              </span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Stay up-to-date with our latest product enhancements, features, performance upgrades, and bug fixes.
            </p>
          </div>

          {/* RSS / Feed Quick Card */}
          <div className="flex flex-col gap-2 shrink-0 rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200/60">
                <Rss className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Public JSON Feed</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-[180px]">
              Syndicate product updates programmatically via JSON.
            </p>
            <a
              href="/api/v1/changelog/feed"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 pt-1"
            >
              <span>Access Feed</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </section>

      {/* Controls Bar: Filters & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
        <CategoryFilter value={category} onChange={setCategory} />
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Timeline Stream */}
      {loading ? (
        <div className="py-16"><LoadingSpinner /></div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="space-y-6">
          <ChangelogTimeline changelogs={changelogs} onToast={setToast} />
          <Pagination page={pagination.page || page} totalPages={pagination.totalPages || 1} onPageChange={setPage} />
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-fade-in border border-slate-700">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

