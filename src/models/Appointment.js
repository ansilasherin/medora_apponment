const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },

    
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    problem: { type: String, default: "" },

    amount: { type: Number, required: true },
    status: { type: String, enum: ["PENDING_PAYMENT", "CONFIRMED"], default: "PENDING_PAYMENT" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
