import mongoose from "mongoose";

const changelogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, trim: true },
    contentMarkdown: { type: String, default: "" },
    category: { type: String, enum: ["New", "Improved", "Fixed"], required: true },
    coverImage: { type: String, default: null }, // relative path, e.g. /uploads/xyz.png
    status: { type: String, enum: ["Draft", "Published"], default: "Draft" },
    publishedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

changelogSchema.index({ status: 1, publishedAt: -1 });
changelogSchema.index({ category: 1 });
// Text index for search (Section 14/29) - fine at assessment scale;
// documented trade-off vs regex search in README.
changelogSchema.index({ title: "text", contentMarkdown: "text" });

export default mongoose.model("Changelog", changelogSchema);
