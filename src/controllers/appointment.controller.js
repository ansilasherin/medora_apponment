const Appointment = require("../models/Appointment");
const Slot = require("../models/Slot");
const Doctor = require("../models/Doctor");

exports.createAppointment = async (req, res) => {
  try {
    const { doctor_id, slot_id, patient_name, age, gender } = req.body || {};
    const doctorId = doctor_id || req.body?.doctorId;
    const slotId = slot_id || req.body?.slotId;
    const patientName = patient_name || req.body?.patientName;

    if (!doctorId || !slotId || !patientName || !age || !gender) {
      return res.status(400).json({ status: false, message: "Missing required fields" });
    }

    const bookedSlot = await Slot.findOneAndUpdate(
      { _id: slotId, doctorId, isBooked: false },
      { $set: { isBooked: true } },
      { new: true }
    );

    if (!bookedSlot) {
      return res.status(400).json({ status: false, message: "Slot already booked / invalid slot" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      await Slot.updateOne({ _id: slotId }, { $set: { isBooked: false } });
      return res.status(404).json({ status: false, message: "Doctor not found" });
    }

    const appointmentData = {
      ...req.body,
      userId: req.user.id,
      doctorId,
      slotId,
      patientName,
      amount: doctor.consultationFee,
      status: "PENDING_PAYMENT"
    };

    const appt = await Appointment.create(appointmentData);

    return res.json({
      status: true,
      appointment_id: appt._id,
      amount: doctor.consultationFee,
      appointment: appt
    });
  } catch (err) {
    if (req.body?.slot_id) {
      await Slot.updateOne({ _id: req.body.slot_id }, { $set: { isBooked: false } }).catch(() => {});
    }
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.doctor_id) filter.doctorId = req.query.doctor_id;
    if (req.query.user_id) filter.userId = req.query.user_id;
    if (req.query.status) filter.status = req.query.status;

    const list = await Appointment.find(filter)
      .populate("doctorId")
      .populate("slotId")
      .populate("userId");

    res.json({ status: true, appointments: list });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate("doctorId")
      .populate("slotId")
      .populate("userId");

    if (!appt) {
      return res.status(404).json({ status: false, message: "Appointment not found" });
    }

    res.json({ status: true, appointment: appt });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { doctor_id, slot_id, patient_name } = req.body || {};
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ status: false, message: "Appointment not found" });
    }

    const doctorId = doctor_id || req.body?.doctorId || appointment.doctorId;
    const slotId = slot_id || req.body?.slotId;

    if (slotId && String(slotId) !== String(appointment.slotId)) {
      const bookedSlot = await Slot.findOneAndUpdate(
        { _id: slotId, doctorId, isBooked: false },
        { $set: { isBooked: true } },
        { new: true }
      );

      if (!bookedSlot) {
        return res.status(400).json({ status: false, message: "Target slot invalid or already booked" });
      }

      await Slot.updateOne({ _id: appointment.slotId }, { $set: { isBooked: false } });
      appointment.slotId = slotId;
    }

    const appointmentData = {
      ...req.body,
      doctorId,
      slotId: slotId || appointment.slotId,
      patientName: patient_name || req.body?.patientName || appointment.patientName,
    };

    appointment.set(appointmentData);

    if (req.body.doctor_id || req.body.doctorId) {
      const doctor = await Doctor.findById(doctorId);
      if (doctor) appointment.amount = doctor.consultationFee;
    }

    await appointment.save();
    res.json({ status: true, message: "Appointment updated", appointment });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ status: false, message: "Appointment not found" });
    }

    await Slot.updateOne({ _id: appointment.slotId }, { $set: { isBooked: false } }).catch(() => {});
    res.json({ status: true, message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
