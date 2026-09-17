import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import MarkdownEditor from "../../components/MarkdownEditor.jsx";
import ImageUploader from "../../components/ImageUploader.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { changelogService } from "../../services/changelogService.js";
import { slugify } from "../../utils/slugify.js";
import { Save, Send, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

const CATEGORIES = [
  { id: "New", label: "#New", desc: "New features & additions", color: "border-emerald-200 bg-emerald-50 text-emerald-800", dot: "bg-emerald-500" },
  { id: "Improved", label: "#Improved", desc: "Speed & UX improvements", color: "border-indigo-200 bg-indigo-50 text-indigo-800", dot: "bg-indigo-500" },
  { id: "Fixed", label: "#Fixed", desc: "Bug fixes & stability", color: "border-amber-200 bg-amber-50 text-amber-800", dot: "bg-amber-500" },
];

export default function ChangelogFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "New",
    contentMarkdown: "",
    coverImage: null,
    status: "Draft",
  });

  useEffect(() => {
    if (mode !== "edit") return;
    changelogService.adminGet(id).then((res) => {
      const c = res.data.data;
      setForm({
        title: c.title,
        category: c.category,
        contentMarkdown: c.contentMarkdown,
        coverImage: c.coverImage,
        status: c.status,
      });
      setLoading(false);
    });
  }, [mode, id]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const save = async (status) => {
    setSaving(true);
    setError("");
    const payload = { ...form, status };
    try {
      if (mode === "edit") {
        await changelogService.adminUpdate(id, payload);
      } else {
        await changelogService.adminCreate(payload);
      }
      setToast(status === "Published" ? "Changelog published successfully." : "Draft saved successfully.");
      setTimeout(() => navigate("/admin/changelogs"), 700);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${status === "Published" ? "publish" : "save draft"}.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Header with back link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/changelogs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-1 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Changelogs</span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {mode === "edit" ? "Edit Product Changelog" : "Create New Product Release"}
          </h1>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={saving || !form.title}
            onClick={() => save("Draft")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saving ? "Saving..." : "Save Draft"}</span>
          </button>
          <button
            type="button"
            disabled={saving || !form.title || !form.contentMarkdown}
            onClick={() => save("Published")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-brand-500/25 hover:bg-brand-700 disabled:opacity-50 transition"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{saving ? "Publishing..." : "Publish Release"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 animate-fade-in">
          {error}
        </div>
      )}

      {/* Title & Metadata Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft space-y-6">
        {/* Title Input */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">Release Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Dark Mode & Performance Improvements"
            className="w-full rounded-xl border border-slate-200/90 bg-white p-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition"
          />
          {form.title && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="font-medium text-slate-500">Slug:</span>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-brand-600">
                /changelog/{slugify(form.title)}
              </code>
            </div>
          )}
        </div>

        {/* Category selector */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-700">Category Tag</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const active = form.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.id })}
                  className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all ${
                    active
                      ? `${cat.color} shadow-sm ring-2 ring-brand-500/20`
                      : "border-slate-200/80 bg-white hover:bg-slate-50/80 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`h-2 w-2 rounded-full ${cat.dot}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">{cat.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{cat.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cover image uploader */}
        <div className="pt-2">
          <ImageUploader value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} />
        </div>
      </div>

      {/* Split-screen Markdown studio */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">Markdown Content & Live Preview</label>
        <MarkdownEditor
          value={form.contentMarkdown}
          onChange={(md) => setForm({ ...form, contentMarkdown: md })}
        />
      </div>

      {/* Floating toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-fade-in border border-slate-700">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

