import { Link } from "react-router-dom";
import CategoryBadge from "./CategoryBadge.jsx";
import ReactionBar from "./ReactionBar.jsx";
import MarkdownPreview from "./MarkdownPreview.jsx";
import { formatDate } from "../utils/formatDate.js";
import { Calendar, ArrowUpRight } from "lucide-react";

export default function ChangelogCard({ changelog, onToast }) {
  return (
    <article className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-soft hover:shadow-cardHover hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200">
      {/* Cover image if present */}
      {changelog.coverImage && (
        <div className="mb-5 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
          <img
            src={changelog.coverImage}
            alt={changelog.title}
            className="w-full max-h-80 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}

      {/* Header Metadata */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <CategoryBadge category={changelog.category} />
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50/80 px-2.5 py-1 rounded-full border border-slate-200/60">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <time dateTime={changelog.publishedAt}>{formatDate(changelog.publishedAt)}</time>
        </div>
      </div>

      {/* Title */}
      <h2 className="mb-4 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
        <Link
          to={`/changelog/${changelog.slug}`}
          className="inline-flex items-center gap-1.5 hover:text-brand-600 transition-colors"
        >
          <span>{changelog.title}</span>
          <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-y-0.5 transition-all text-brand-500" />
        </Link>
      </h2>

      {/* Body Content */}
      <div className="mb-6">
        <MarkdownPreview markdown={changelog.contentMarkdown} />
      </div>

      {/* Footer Reaction Bar */}
      <ReactionBar
        changelogId={changelog._id}
        slug={changelog.slug}
        reactions={changelog.reactions}
        userReaction={changelog.userReaction}
        onToast={onToast}
      />
    </article>
  );
}

