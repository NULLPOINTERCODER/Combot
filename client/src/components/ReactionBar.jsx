import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { changelogService } from "../services/changelogService.js";
import { Share2, Check } from "lucide-react";

const REACTION_META = {
  heart: { emoji: "❤️", label: "Love" },
  celebrate: { emoji: "🎉", label: "Celebrate" },
  rocket: { emoji: "🚀", label: "Excited" },
};

export default function ReactionBar({ changelogId, slug, reactions, userReaction, onToast }) {
  const { isAuthenticated } = useAuth();
  const [counts, setCounts] = useState(reactions || { heart: 0, celebrate: 0, rocket: 0 });
  const [active, setActive] = useState(userReaction || null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClick = async (type) => {
    if (!isAuthenticated) {
      onToast?.("Please log in to react to this update.");
      return;
    }
    if (busy) return;
    setBusy(true);

    const prevCounts = counts;
    const prevActive = active;

    // optimistic update
    const next = { ...counts };
    if (active === type) {
      next[type] = Math.max(0, next[type] - 1);
      setActive(null);
    } else {
      if (active) next[active] = Math.max(0, next[active] - 1);
      next[type] = next[type] + 1;
      setActive(type);
    }
    setCounts(next);

    try {
      if (prevActive === type) {
        const res = await changelogService.unreact(changelogId, type);
        setCounts({ heart: res.data.data.heart, celebrate: res.data.data.celebrate, rocket: res.data.data.rocket });
        setActive(res.data.data.userReaction);
      } else {
        const res = await changelogService.react(changelogId, type);
        setCounts({ heart: res.data.data.heart, celebrate: res.data.data.celebrate, rocket: res.data.data.rocket });
        setActive(res.data.data.userReaction);
      }
    } catch (err) {
      setCounts(prevCounts);
      setActive(prevActive);
      onToast?.(err.response?.data?.message || "Failed to react.");
    } finally {
      setBusy(false);
    }
  };

  const handleShare = () => {
    const url = slug ? `${window.location.origin}/changelog/${slug}` : window.location.href;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    onToast?.("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
      {/* Reactions */}
      <div className="flex items-center gap-2">
        {Object.entries(REACTION_META).map(([type, { emoji, label }]) => {
          const isSelected = active === type;
          const count = counts[type] || 0;
          return (
            <button
              key={type}
              onClick={() => handleClick(type)}
              disabled={busy}
              title={`${label} (${count})`}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150 transform active:scale-95 ${
                isSelected
                  ? "border border-brand-500/80 bg-brand-50 text-brand-700 shadow-sm shadow-brand-500/10 scale-105"
                  : "border border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:scale-105"
              }`}
            >
              <span className="text-sm">{emoji}</span>
              <span className={isSelected ? "font-bold text-brand-700" : "text-slate-500"}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Share / Copy link */}
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
        title="Copy link to update"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
        <span>{copied ? "Copied" : "Share"}</span>
      </button>
    </div>
  );
}

