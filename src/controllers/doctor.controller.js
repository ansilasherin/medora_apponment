const Doctor = require("../models/Doctor");

exports.createDoctor = async (req, res) => {
  try {
    const { name, specialistId, consultationFee } = req.body || {};

    if ((!name && !req.body.userId) || !specialistId || consultationFee == null) {
      return res.status(400).json({
        success: false,
        status: false,
        message: "specialistId and consultationFee required, plus name or userId"
      });
    }

    const doc = await Doctor.create({ ...req.body });

    res.status(201).json({
      success: true,
      status: true,
      message: "Doctor created successfully",
      doctor: doc
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const { specialistId, specialist_id, search, page, limit } = req.query;

    const specId = specialistId || specialist_id;
    const filter = {};
    if (specId) filter.specialistId = specId;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { biography: { $regex: search, $options: "i" } },
        { about: { $regex: search, $options: "i" } }
      ];
    }

    const pageNum = page ? parseInt(page) : null;
    const limitNum = limit ? parseInt(limit) : null;

    let query = Doctor.find(filter)
      .populate("specialistId", "name icon description")
      .populate("userId", "name email phone profilePic");

    if (pageNum && limitNum) {
      const skip = (pageNum - 1) * limitNum;
      query = query.skip(skip).limit(limitNum);
    }

    const [list, total] = await Promise.all([
      query.exec(),
      Doctor.countDocuments(filter)
    ]);

    res.json({
      success: true,
      status: true,
      doctors: list,
      total,
      page: pageNum || 1,
      pages: limitNum ? Math.ceil(total / limitNum) : 1
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doc = await Doctor.findById(req.params.id)
      .populate("specialistId", "name icon description")
      .populate("userId", "name email phone profilePic");

    if (!doc) {
      return res.status(404).json({ success: false, status: false, message: "Doctor not found" });
    }

    res.json({
      success: true,
      status: true,
      doctor: doc
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doc = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      strict: false,
    });

    if (!doc) {
      return res.status(404).json({ success: false, status: false, message: "Doctor not found" });
    }

    res.json({
      success: true,
      status: true,
      message: "Doctor updated successfully",
      doctor: doc
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doc = await Doctor.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, status: false, message: "Doctor not found" });
    }

    res.json({
      success: true,
      status: true,
      message: "Doctor deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};
