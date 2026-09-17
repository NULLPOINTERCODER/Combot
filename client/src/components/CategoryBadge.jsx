const CATEGORY_STYLES = {
  New: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200/70",
    dot: "bg-emerald-500",
    label: "#New",
  },
  Improved: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200/70",
    dot: "bg-indigo-500",
    label: "#Improved",
  },
  Fixed: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200/70",
    dot: "bg-amber-500",
    label: "#Fixed",
  },
};

export default function CategoryBadge({ category }) {
  const style = CATEGORY_STYLES[category] || {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
    label: category,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${style.bg} ${style.text} ${style.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {category}
    </span>
  );
}

