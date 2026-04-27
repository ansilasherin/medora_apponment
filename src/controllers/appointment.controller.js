const Appointment = require("../models/Appointment");
const Slot = require("../models/Slot");
const Doctor = require("../models/Doctor");

exports.createAppointment = async (req, res) => {
  try {
    const { doctor_id, slot_id, patient_name, age, gender, problem } = req.body || {};

    if (!doctor_id || !slot_id || !patient_name || !age || !gender) {
      return res.status(400).json({ status: false, message: "Missing fields" });
    }

    const bookedSlot = await Slot.findOneAndUpdate(
      { _id: slot_id, doctorId: doctor_id, isBooked: false },
      { $set: { isBooked: true } },
      { new: true }
    );

    if (!bookedSlot) {
      return res.status(400).json({ status: false, message: "Slot already booked / invalid slot" });
    }

    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      await Slot.updateOne({ _id: slot_id }, { $set: { isBooked: false } });
      return res.status(404).json({ status: false, message: "Doctor not found" });
    }

    const appt = await Appointment.create({
      userId: req.user.id,
      doctorId: doctor_id,
      slotId: slot_id,
      patientName: patient_name,
      age,
      gender,
      problem: problem || "",
      amount: doctor.consultationFee,
      status: "PENDING_PAYMENT"
    });

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
      .populate("doctorId", "name consultationFee about")
      .populate("slotId", "date time")
      .populate("userId", "name email");

    res.json({ status: true, appointments: list });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate("doctorId", "name consultationFee about")
      .populate("slotId", "date time")
      .populate("userId", "name email");

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
    const { doctor_id, slot_id, patient_name, age, gender, problem } = req.body || {};
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ status: false, message: "Appointment not found" });
    }

    if (slot_id && String(slot_id) !== String(appointment.slotId)) {
      const selectedDoctorId = doctor_id || appointment.doctorId;
      const bookedSlot = await Slot.findOneAndUpdate(
        { _id: slot_id, doctorId: selectedDoctorId, isBooked: false },
        { $set: { isBooked: true } },
        { new: true }
      );

      if (!bookedSlot) {
        return res.status(400).json({ status: false, message: "Target slot invalid or already booked" });
      }

      await Slot.updateOne({ _id: appointment.slotId }, { $set: { isBooked: false } });
      appointment.slotId = slot_id;
    }

    if (doctor_id) appointment.doctorId = doctor_id;
    if (patient_name !== undefined) appointment.patientName = patient_name;
    if (age !== undefined) appointment.age = age;
    if (gender !== undefined) appointment.gender = gender;
    if (problem !== undefined) appointment.problem = problem;

    if (doctor_id) {
      const doctor = await Doctor.findById(doctor_id);
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
