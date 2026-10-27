const Appointment = require("../models/Appointment");
const Slot = require("../models/Slot");
const Doctor = require("../models/Doctor");

exports.createAppointment = async (req, res) => {
  try {
    const { doctor_id, slot_id, patient_name, age, gender, problem, notes } = req.body || {};
    const doctorId = doctor_id || req.body?.doctorId;
    const slotId = slot_id || req.body?.slotId;
    const patientName = patient_name || req.body?.patientName || req.user?.name || "Patient";

    if (!doctorId || !slotId) {
      return res.status(400).json({ success: false, status: false, message: "doctorId and slotId are required" });
    }

    // Try booking the slot
    const bookedSlot = await Slot.findOneAndUpdate(
      {
        _id: slotId,
        doctorId,
        $or: [{ isBooked: false }, { isAvailable: true }]
      },
      { $set: { isBooked: true, isAvailable: false } },
      { new: true }
    );

    if (!bookedSlot) {
      return res.status(400).json({ success: false, status: false, message: "Slot already booked or invalid slot" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      await Slot.updateOne({ _id: slotId }, { $set: { isBooked: false, isAvailable: true } });
      return res.status(404).json({ success: false, status: false, message: "Doctor not found" });
    }

    const appointmentData = {
      userId: req.user.id,
      patientId: req.user.id,
      doctorId,
      slotId,
      patientName,
      age: age || 25,
      gender: gender || "Not Specified",
      problem: problem || notes || "",
      notes: notes || problem || "",
      amount: doctor.consultationFee,
      status: "pending",
      paymentStatus: "unpaid",
      appointmentDate: bookedSlot.startTime || bookedSlot.date || new Date().toISOString()
    };

    const appt = await Appointment.create(appointmentData);

    return res.status(201).json({
      success: true,
      status: true,
      message: "Appointment booked successfully",
      appointment_id: appt._id,
      amount: doctor.consultationFee,
      appointment: appt
    });
  } catch (err) {
    if (req.body?.slotId || req.body?.slot_id) {
      const slotId = req.body.slotId || req.body.slot_id;
      await Slot.updateOne({ _id: slotId }, { $set: { isBooked: false, isAvailable: true } }).catch(() => {});
    }
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const { status, doctorId, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) {
      filter.$or = [
        { status: status },
        { status: status.toUpperCase() }
      ];
    }
    if (doctorId) filter.doctorId = doctorId;

    // Non-admin users only see their own appointments (or doctor seeing appointments booked with them)
    if (req.user.role === "doctor") {
      // Find doctor record for this user
      const doc = await Doctor.findOne({ userId: req.user.id });
      if (doc) filter.doctorId = doc._id;
    } else if (req.user.role !== "admin") {
      filter.$or = [{ userId: req.user.id }, { patientId: req.user.id }];
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate("doctorId")
        .populate("slotId")
        .populate("userId", "name email phone profilePic")
        .populate("patientId", "name email phone profilePic")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Appointment.countDocuments(filter)
    ]);

    res.json({
      success: true,
      status: true,
      appointments,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate("doctorId")
      .populate("slotId")
      .populate("userId", "name email phone profilePic")
      .populate("patientId", "name email phone profilePic");

    if (!appt) {
      return res.status(404).json({ success: false, status: false, message: "Appointment not found" });
    }

    res.json({
      success: true,
      status: true,
      appointment: appt
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      strict: false
    })
      .populate("doctorId")
      .populate("slotId");

    if (!appt) {
      return res.status(404).json({ success: false, status: false, message: "Appointment not found" });
    }

    res.json({
      success: true,
      status: true,
      message: "Appointment updated successfully",
      appointment: appt
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body || {};

    const appt = await Appointment.findById(req.params.id);
    if (!appt) {
      return res.status(404).json({ success: false, status: false, message: "Appointment not found" });
    }

    appt.status = "cancelled";
    if (reason) appt.cancellationReason = reason;
    await appt.save();

    // Free up the slot
    if (appt.slotId) {
      await Slot.findByIdAndUpdate(appt.slotId, {
        isBooked: false,
        isAvailable: true
      });
    }

    res.json({
      success: true,
      status: true,
      message: "Appointment cancelled successfully",
      appointment: appt
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndDelete(req.params.id);
    if (!appt) {
      return res.status(404).json({ success: false, status: false, message: "Appointment not found" });
    }

    // Free up the slot if it was booked
    if (appt.slotId) {
      await Slot.findByIdAndUpdate(appt.slotId, {
        isBooked: false,
        isAvailable: true
      });
    }

    res.json({
      success: true,
      status: true,
      message: "Appointment deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};
