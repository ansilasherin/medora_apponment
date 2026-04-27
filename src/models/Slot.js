const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    time: { type: String, required: true }, // "10:30 AM"
    isBooked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Avoid duplicate slots for same doctor/date/time
slotSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("Slot", slotSchema);
