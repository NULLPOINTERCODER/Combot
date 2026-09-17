export default function StatusBadge({ status }) {
  const isPublished = status === "Published";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        isPublished
          ? "border-emerald-200/70 bg-emerald-50 text-emerald-700"
          : "border-amber-200/70 bg-amber-50 text-amber-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isPublished ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      {status}
    </span>
  );
}

