const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String }, // "YYYY-MM-DD"
    time: { type: String }, // "10:30 AM"
    startTime: { type: String }, // ISO string or time string
    endTime: { type: String },
    isAvailable: { type: Boolean, default: true },
    isBooked: { type: Boolean, default: false }
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model("Slot", slotSchema);
