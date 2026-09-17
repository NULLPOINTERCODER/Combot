export function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Ensures uniqueness by appending -1, -2, ... if needed.
// existsFn(candidateSlug) => Promise<boolean>
export async function generateUniqueSlug(baseText, existsFn) {
  const base = slugify(baseText) || "changelog";
  let candidate = base;
  let counter = 1;
  while (await existsFn(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  return candidate;
}
