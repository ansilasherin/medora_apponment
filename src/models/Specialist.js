const mongoose = require("mongoose");

const specialistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model("Specialist", specialistSchema);
