import { Sparkles, Inbox } from "lucide-react";

export default function EmptyState({ title = "No updates found", description = "Try searching with different keywords or check back later." }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3 border border-slate-200/60">
        <Inbox className="h-6 w-6" />
      </div>
      <p className="text-base font-bold text-slate-900">{title}</p>
      {description && <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">{description}</p>}
    </div>
  );
}

