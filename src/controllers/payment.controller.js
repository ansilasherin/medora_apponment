const Appointment = require("../models/Appointment");

exports.initiatePayment = async (req, res) => {
  try {
    const { appointment_id, payment_method } = req.body || {};

    if (!appointment_id || !payment_method) {
      return res.status(400).json({ status: false, message: "appointment_id and payment_method required" });
    }

    const appt = await Appointment.findById(appointment_id);
    if (!appt) return res.status(404).json({ status: false, message: "Appointment not found" });

    appt.status = "CONFIRMED";
    await appt.save();

    res.json({ status: true, message: "Payment success", appointment_id, booking_status: "CONFIRMED" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ status: false, message: "Appointment not found" });

    res.json({ status: true, payment: { appointment_id: appt._id, status: appt.status, amount: appt.amount } });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!status) {
      return res.status(400).json({ status: false, message: "status is required" });
    }

    const allowed = ["PENDING_PAYMENT", "CONFIRMED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ status: false, message: "Invalid status" });
    }

    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ status: false, message: "Appointment not found" });

    appt.status = status;
    await appt.save();

    res.json({ status: true, message: "Payment status updated", payment: { appointment_id: appt._id, status: appt.status } });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.cancelPayment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ status: false, message: "Appointment not found" });

    appt.status = "PENDING_PAYMENT";
    await appt.save();

    res.json({ status: true, message: "Payment canceled", payment: { appointment_id: appt._id, status: appt.status } });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
