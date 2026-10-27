const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentMethod: { type: String, default: "card" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending"
    },
    transactionId: { type: String, default: "" },
    paymentUrl: { type: String, default: "" }
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model("Payment", paymentSchema);
