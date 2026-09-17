import { Link } from "react-router-dom";
import CategoryBadge from "./CategoryBadge.jsx";
import { formatDate } from "../utils/formatDate.js";
import { ChevronRight } from "lucide-react";

export default function NotificationItem({ item, onClick }) {
  return (
    <Link
      to={`/changelog/${item.slug}`}
      onClick={onClick}
      className="group block rounded-xl border border-slate-200/70 bg-white p-3.5 transition-all hover:border-brand-200 hover:bg-brand-50/30 hover:shadow-sm"
    >
      <div className="mb-1.5 flex items-center justify-between">
        <CategoryBadge category={item.category} />
        <span className="text-[11px] font-medium text-slate-400">{formatDate(item.publishedAt)}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
          {item.title}
        </p>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
      </div>
      {item.excerpt && (
        <p className="mt-1 line-clamp-2 text-xs text-slate-500 leading-relaxed">{item.excerpt}</p>
      )}
    </Link>
  );
}

