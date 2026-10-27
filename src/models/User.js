const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
      trim: true
    },
    dateOfBirth: { type: String, default: "" },
    gender: { type: String, default: "" },
    address: { type: String, default: "" },
    profilePic: { type: String, default: "" }
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model("User", userSchema);
