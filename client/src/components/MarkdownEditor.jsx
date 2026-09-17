import { useRef } from "react";
import MarkdownPreview from "./MarkdownPreview.jsx";
import { Bold, Italic, Heading1, Heading2, List, Code, Quote, Link as LinkIcon, Sparkles } from "lucide-react";

export default function MarkdownEditor({ value, onChange }) {
  const textareaRef = useRef(null);

  const insertFormat = (before, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousValue = value || "";
    const selectedText = previousValue.substring(start, end) || "text";

    const updatedText =
      previousValue.substring(0, start) +
      before +
      selectedText +
      after +
      previousValue.substring(end);

    onChange(updatedText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 50);
  };

  const tools = [
    { label: "H1", icon: Heading1, action: () => insertFormat("# ") },
    { label: "H2", icon: Heading2, action: () => insertFormat("## ") },
    { label: "Bold", icon: Bold, action: () => insertFormat("**", "**") },
    { label: "Italic", icon: Italic, action: () => insertFormat("*", "*") },
    { label: "List", icon: List, action: () => insertFormat("* ") },
    { label: "Code", icon: Code, action: () => insertFormat("`", "`") },
    { label: "Quote", icon: Quote, action: () => insertFormat("> ") },
    { label: "Link", icon: LinkIcon, action: () => insertFormat("[", "](https://example.com)") },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Editor column */}
      <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-soft overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200/80 px-3 py-2 bg-slate-50/70">
          <div className="flex items-center gap-1">
            {tools.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={t.action}
                  title={t.label}
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 transition"
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
          <span className="text-[11px] font-mono font-medium text-slate-400 hidden sm:inline">Markdown</span>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={16}
          placeholder={"# Release Highlights\n\nWe are excited to launch...\n\n## Key Improvements\n* 🚀 Faster page load speeds\n* 🎨 Brand new UI widgets"}
          className="w-full flex-1 p-4 font-mono text-xs sm:text-sm text-slate-800 focus:outline-none resize-y min-h-[360px]"
        />
      </div>

      {/* Live Preview column */}
      <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-soft overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-2.5 bg-slate-50/70">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-brand-600" />
            Live Preview
          </span>
          <span className="text-[11px] text-slate-400">Updates as you type</span>
        </div>
        <div className="flex-1 p-5 overflow-y-auto max-h-[500px] min-h-[360px] bg-slate-50/20">
          <MarkdownPreview markdown={value} />
        </div>
      </div>
    </div>
  );
}

