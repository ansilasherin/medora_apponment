const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, trim: true },
    photo: { type: String, default: "" },
    specialistId: { type: mongoose.Schema.Types.ObjectId, ref: "Specialist", required: true },
    licenseNumber: { type: String, default: "" },
    consultationFee: { type: Number, required: true },
    about: { type: String, default: "" },
    biography: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    qualifications: { type: [String], default: ["MBBS"] },
    rating: { type: Number, default: 4.8 },
    workingHours: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        monday: { start: "09:00", end: "17:00" },
        tuesday: { start: "09:00", end: "17:00" },
        wednesday: { start: "09:00", end: "17:00" },
        thursday: { start: "09:00", end: "17:00" },
        friday: { start: "09:00", end: "17:00" }
      }
    }
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model("Doctor", doctorSchema);
