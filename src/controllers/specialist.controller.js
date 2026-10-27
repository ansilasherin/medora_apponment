const Specialist = require("../models/Specialist");

exports.getAllSpecialists = async (req, res) => {
  try {
    const list = await Specialist.find().sort({ name: 1 });
    res.json({
      success: true,
      status: true,
      specialists: list
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.getSpecialistById = async (req, res) => {
  try {
    const specialist = await Specialist.findById(req.params.id);
    if (!specialist) {
      return res.status(404).json({ success: false, status: false, message: "Specialist not found" });
    }

    res.json({
      success: true,
      status: true,
      specialist
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.createSpecialist = async (req, res) => {
  try {
    const { name, description, icon } = req.body || {};

    if (!name) {
      return res.status(400).json({
        success: false,
        status: false,
        message: "name is required"
      });
    }

    const sp = await Specialist.create({
      name,
      description: description || "",
      icon: icon || "",
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    res.status(201).json({
      success: true,
      status: true,
      message: "Specialist created successfully",
      specialist: sp
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.updateSpecialist = async (req, res) => {
  try {
    const specialist = await Specialist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      strict: false,
    });

    if (!specialist) {
      return res.status(404).json({ success: false, status: false, message: "Specialist not found" });
    }

    res.json({
      success: true,
      status: true,
      message: "Specialist updated successfully",
      specialist
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.deleteSpecialist = async (req, res) => {
  try {
    const specialist = await Specialist.findByIdAndDelete(req.params.id);
    if (!specialist) {
      return res.status(404).json({ success: false, status: false, message: "Specialist not found" });
    }

    res.json({
      success: true,
      status: true,
      message: "Specialist deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};
