import { useState } from "react";
import { ImagePlus, Trash2, Loader2, ImageIcon } from "lucide-react";
import { uploadService } from "../services/uploadService.js";

export default function ImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const res = await uploadService.uploadImage(file);
      onChange(res.data.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Supported: JPG, PNG, WEBP (Max 5MB)");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-700">Cover Image (Optional)</label>
      {value ? (
        <div className="relative group w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-soft">
          <img src={value} alt="Cover preview" className="w-full h-44 object-cover" />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-red-700 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove Cover</span>
            </button>
          </div>
        </div>
      ) : (
        <label className="flex w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-slate-500 hover:border-brand-300 hover:bg-brand-50/30 transition">
          {uploading ? (
            <Loader2 className="h-7 w-7 text-brand-600 animate-spin" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs border border-slate-200 text-slate-600">
              <ImagePlus className="h-5 w-5" />
            </div>
          )}
          <div className="text-center">
            <span className="text-xs font-semibold text-slate-700">
              {uploading ? "Uploading cover..." : "Upload cover image"}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG or WEBP up to 5MB</p>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}
      {error && <p className="mt-1.5 text-xs font-medium text-red-600 animate-fade-in">{error}</p>}
    </div>
  );
}

