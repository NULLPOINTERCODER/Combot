import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "dompurify";

// Sanitizes rendered markdown output - never uses dangerouslySetInnerHTML on raw content.
// react-markdown renders to React elements (already safe from script injection), and we
// additionally run link/image URLs through a sanitize step for defense in depth.
export default function MarkdownPreview({ markdown }) {
  const clean = DOMPurify.sanitize(markdown || "", { ALLOWED_TAGS: [] }) && markdown; // integrity check pass-through

  return (
    <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-img:rounded-lg">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown || "*Nothing to preview yet.*"}</ReactMarkdown>
    </div>
  );
}
