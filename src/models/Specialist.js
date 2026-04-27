const mongoose = require("mongoose");

const specialistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Specialist", specialistSchema);
