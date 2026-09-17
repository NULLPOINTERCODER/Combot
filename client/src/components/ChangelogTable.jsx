import { Link } from "react-router-dom";
import { Pencil, Trash2, Send, Undo2, ExternalLink } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import CategoryBadge from "./CategoryBadge.jsx";
import { formatDate } from "../utils/formatDate.js";

export default function ChangelogTable({ items, onDelete, onPublish, onUnpublish }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-soft md:block">
        <table className="min-w-full divide-y divide-slate-200/80 text-sm">
          <thead className="bg-slate-50/80 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3.5">Title</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Published Date</th>
              <th className="px-5 py-3.5">Created</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{c.title}</span>
                    <span className="text-[11px] font-mono text-slate-400">/{c.slug}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <CategoryBadge category={c.category} />
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-5 py-4 text-xs font-medium text-slate-500">
                  {formatDate(c.publishedAt) || "—"}
                </td>
                <td className="px-5 py-4 text-xs font-medium text-slate-400">
                  {formatDate(c.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    {c.status === "Published" && (
                      <Link
                        to={`/changelog/${c.slug}`}
                        target="_blank"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                        title="View live release"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      to={`/admin/changelogs/${c._id}/edit`}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition"
                      title="Edit release"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    {c.status === "Draft" ? (
                      <button
                        onClick={() => onPublish(c._id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition"
                        title="Publish now"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onUnpublish(c._id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition"
                        title="Unpublish (revert to draft)"
                      >
                        <Undo2 className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(c._id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {items.map((c) => (
          <div key={c._id} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft">
            <div className="mb-2 flex items-center justify-between">
              <CategoryBadge category={c.category} />
              <StatusBadge status={c.status} />
            </div>
            <p className="mb-1 font-bold text-slate-900">{c.title}</p>
            <p className="mb-3 text-[11px] text-slate-400">Created {formatDate(c.createdAt)}</p>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <Link
                to={`/admin/changelogs/${c._id}/edit`}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Edit
              </Link>
              {c.status === "Draft" ? (
                <button
                  onClick={() => onPublish(c._id)}
                  className="flex-1 rounded-xl bg-emerald-50 border border-emerald-200/80 py-1.5 text-xs font-semibold text-emerald-700"
                >
                  Publish
                </button>
              ) : (
                <button
                  onClick={() => onUnpublish(c._id)}
                  className="flex-1 rounded-xl bg-amber-50 border border-amber-200/80 py-1.5 text-xs font-semibold text-amber-700"
                >
                  Unpublish
                </button>
              )}
              <button
                onClick={() => onDelete(c._id)}
                className="rounded-xl border border-red-200 bg-red-50 p-1.5 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

