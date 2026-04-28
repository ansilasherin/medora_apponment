const Slot = require("../models/Slot");

exports.createSlotsForDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const dateRaw = req.body?.date;
    const times = req.body?.times;

    const date = String(dateRaw || "").trim();
    if (!date || !Array.isArray(times) || times.length === 0) {
      return res.status(400).json({ status: false, message: "date and times[] required" });
    }

    const created = [];
    for (const t of times) {
      const time = String(t || "").trim();
      if (!time) continue;

      try {
        const s = await Slot.create({ doctorId, date, time, isBooked: false });
        created.push(s);
      } catch (e) {
        // ignore duplicates
      }
    }

    res.json({ status: true, message: "Slots added", count: created.length, slots: created });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getSlotsByDoctorAndDate = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const date = String(req.query.date || "").trim();

    if (!date) return res.status(400).json({ status: false, message: "date is required" });

    const slots = await Slot.find({ doctorId, date }).sort({ time: 1 });

    res.json({
      status: true,
      slots,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getSlotById = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id).populate("doctorId");
    if (!slot) return res.status(404).json({ status: false, message: "Slot not found" });

    res.json({ status: true, slot });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateSlot = async (req, res) => {
  try {
    const slot = await Slot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      strict: false,
    });

    if (!slot) return res.status(404).json({ status: false, message: "Slot not found" });
    res.json({ status: true, message: "Slot updated", slot });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findByIdAndDelete(req.params.id);
    if (!slot) return res.status(404).json({ status: false, message: "Slot not found" });

    res.json({ status: true, message: "Slot deleted" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
