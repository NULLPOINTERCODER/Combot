const CATEGORIES = [
  { id: "All", label: "All Updates", dot: "bg-slate-400" },
  { id: "New", label: "#New", dot: "bg-emerald-500" },
  { id: "Improved", label: "#Improved", dot: "bg-indigo-500" },
  { id: "Fixed", label: "#Fixed", dot: "bg-amber-500" },
];

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-200/50 border border-slate-200/70">
      {CATEGORIES.map((cat) => {
        const active = value === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
              active
                ? "bg-white text-slate-900 shadow-sm shadow-slate-900/5 ring-1 ring-slate-900/5 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

