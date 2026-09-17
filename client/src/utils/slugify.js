// Client-side preview only - the backend is the source of truth for uniqueness (Section 31).
export function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
