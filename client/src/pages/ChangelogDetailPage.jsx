import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ChangelogCard from "../components/ChangelogCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { changelogService } from "../services/changelogService.js";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function ChangelogDetailPage() {
  const { slug } = useParams();
  const [changelog, setChangelog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    setLoading(true);
    changelogService
      .getBySlug(slug)
      .then((res) => setChangelog(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Changelog not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Updates</span>
        </Link>
      </div>

      <ChangelogCard changelog={changelog} onToast={setToast} />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-fade-in border border-slate-700">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

