const Specialist = require("../models/Specialist");

exports.getAllSpecialists = async (req, res) => {
  try {
    const list = await Specialist.find().sort({ name: 1 });
    res.json({ status: true, specialists: list });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getSpecialistById = async (req, res) => {
  try {
    const specialist = await Specialist.findById(req.params.id);
    if (!specialist) return res.status(404).json({ status: false, message: "Specialist not found" });

    res.json({ status: true, specialist });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.createSpecialist = async (req, res) => {
  try {
    const { name, icon } = req.body || {};

    if (!name) {
      return res.status(400).json({
        status: false,
        message: "name is required"
      });
    }

    const sp = await Specialist.create({
      name,
      icon: icon || ""
    });

    res.json({
      status: true,
      message: "Specialist created",
      specialist: sp
    });

  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateSpecialist = async (req, res) => {
  try {
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.icon !== undefined) updateData.icon = req.body.icon;

    const specialist = await Specialist.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!specialist) return res.status(404).json({ status: false, message: "Specialist not found" });

    res.json({ status: true, message: "Specialist updated", specialist });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteSpecialist = async (req, res) => {
  try {
    const specialist = await Specialist.findByIdAndDelete(req.params.id);
    if (!specialist) return res.status(404).json({ status: false, message: "Specialist not found" });

    res.json({ status: true, message: "Specialist deleted" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
