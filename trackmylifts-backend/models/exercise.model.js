const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

exerciseSchema.index({ name: "text", tags: "text" });

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;
