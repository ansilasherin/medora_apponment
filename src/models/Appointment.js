const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },

    patientName: { type: String, default: "" },
    age: { type: Number },
    gender: { type: String, default: "" },
    problem: { type: String, default: "" },
    notes: { type: String, default: "" },

    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "PENDING_PAYMENT", "CONFIRMED", "CANCELLED"],
      default: "pending"
    },
    appointmentDate: { type: String, default: "" },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded", "pending", "completed"],
      default: "unpaid"
    },
    cancellationReason: { type: String, default: "" }
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
