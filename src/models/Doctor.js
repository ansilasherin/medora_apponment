const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: "" },

    specialistId: { type: mongoose.Schema.Types.ObjectId, ref: "Specialist", required: true },

    consultationFee: { type: Number, required: true },
    about: { type: String, default: "" },

    experience: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
