const Doctor = require("../models/Doctor");

exports.createDoctor = async (req, res) => {
  try {
    const { name, specialistId, consultationFee, about, photo, experience, rating } = req.body || {};

    if (!name || !specialistId || consultationFee == null) {
      return res.status(400).json({ status: false, message: "name, specialistId, consultationFee required" });
    }

    const doc = await Doctor.create({
      name,
      specialistId,
      consultationFee,
      about: about || "",
      photo: photo || "",
      experience: experience || 0,
      rating: rating || 4.5
    });

    res.json({ status: true, message: "Doctor created", doctor: doc });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const { specialist_id } = req.query;

    const filter = specialist_id ? { specialistId: specialist_id } : {};
    const list = await Doctor.find(filter).select("name specialistId consultationFee rating experience photo");

    res.json({ status: true, doctors: list });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doc = await Doctor.findById(req.params.id).populate("specialistId", "name icon");
    if (!doc) return res.status(404).json({ status: false, message: "Doctor not found" });

    res.json({ status: true, doctor: doc });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const updateData = {};
    const fields = ["name", "specialistId", "consultationFee", "about", "photo", "experience", "rating"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const doc = await Doctor.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!doc) return res.status(404).json({ status: false, message: "Doctor not found" });

    res.json({ status: true, message: "Doctor updated", doctor: doc });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doc = await Doctor.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ status: false, message: "Doctor not found" });

    res.json({ status: true, message: "Doctor deleted" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
