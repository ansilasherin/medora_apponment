const Slot = require("../models/Slot");

// GET /api/slots/doctor/:doctorId
exports.getSlotsByDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId || req.params.id;
    const { date, available } = req.query;

    const filter = { doctorId };

    if (date) {
      filter.$or = [
        { date: date },
        { startTime: { $regex: `^${date}` } }
      ];
    }

    if (available !== undefined) {
      const isAvail = available === "true" || available === true;
      filter.$or = [
        { isAvailable: isAvail },
        { isBooked: !isAvail }
      ];
    }

    const slots = await Slot.find(filter).sort({ startTime: 1, time: 1 });

    res.json({
      success: true,
      status: true,
      slots
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// POST /api/slots - Create single or bulk slot
exports.createSlot = async (req, res) => {
  try {
    const { doctorId, startTime, endTime, date, time } = req.body;

    if (!doctorId) {
      return res.status(400).json({ success: false, status: false, message: "doctorId is required" });
    }

    const newSlot = await Slot.create({
      doctorId,
      startTime: startTime || "",
      endTime: endTime || "",
      date: date || (startTime ? startTime.split("T")[0] : ""),
      time: time || "",
      isAvailable: true,
      isBooked: false
    });

    res.status(201).json({
      success: true,
      status: true,
      message: "Slot created successfully",
      slot: newSlot
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// Batch create slots (convenient for calendar generation)
exports.createSlotsForDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id || req.body?.doctorId;
    const dateRaw = req.body?.date;
    const times = req.body?.times;

    const date = String(dateRaw || "").trim();
    if (!date || !Array.isArray(times) || times.length === 0) {
      return res.status(400).json({ success: false, status: false, message: "date and times[] required" });
    }

    const created = [];
    for (const t of times) {
      const time = String(t || "").trim();
      if (!time) continue;

      try {
        const s = await Slot.create({
          doctorId,
          date,
          time,
          startTime: `${date}T${time}`,
          isBooked: false,
          isAvailable: true
        });
        created.push(s);
      } catch (e) {
        // ignore duplicate
      }
    }

    res.json({
      success: true,
      status: true,
      message: "Slots added successfully",
      count: created.length,
      slots: created
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.getSlotsByDoctorAndDate = async (req, res) => {
  return exports.getSlotsByDoctor(req, res);
};

exports.getSlotById = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id).populate("doctorId");
    if (!slot) {
      return res.status(404).json({ success: false, status: false, message: "Slot not found" });
    }

    res.json({ success: true, status: true, slot });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.updateSlot = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.body.isAvailable !== undefined) {
      updateData.isBooked = !req.body.isAvailable;
    } else if (req.body.isBooked !== undefined) {
      updateData.isAvailable = !req.body.isBooked;
    }

    const slot = await Slot.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
      strict: false,
    });

    if (!slot) {
      return res.status(404).json({ success: false, status: false, message: "Slot not found" });
    }

    res.json({
      success: true,
      status: true,
      message: "Slot updated successfully",
      slot
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({ success: false, status: false, message: "Slot not found" });
    }

    res.json({
      success: true,
      status: true,
      message: "Slot deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};
