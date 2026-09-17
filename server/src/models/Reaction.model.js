import mongoose from "mongoose";

// DESIGN DECISION (documented in README too):
// One reaction per user per changelog, and the user CAN change it.
// So the unique constraint is on (userId + changelogId) only, and `type`
// is simply updated in place when the user picks a different reaction.
const reactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    changelogId: { type: mongoose.Schema.Types.ObjectId, ref: "Changelog", required: true },
    type: { type: String, enum: ["heart", "celebrate", "rocket"], required: true },
  },
  { timestamps: true }
);

reactionSchema.index({ userId: 1, changelogId: 1 }, { unique: true });
reactionSchema.index({ changelogId: 1 });

export default mongoose.model("Reaction", reactionSchema);
