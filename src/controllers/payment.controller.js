const Payment = require("../models/Payment");
const Appointment = require("../models/Appointment");

// GET /api/payments - List all payments (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const { status, userId, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate("appointmentId")
        .populate("userId", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Payment.countDocuments(filter)
    ]);

    res.json({
      success: true,
      status: true,
      payments,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// POST /api/payments/initiate - Initiate payment
exports.initiatePayment = async (req, res) => {
  try {
    const appointmentId = req.body.appointmentId || req.body.appointment_id;
    const paymentMethod = req.body.paymentMethod || req.body.payment_method || "card";
    const amount = req.body.amount;

    if (!appointmentId) {
      return res.status(400).json({ success: false, status: false, message: "appointmentId is required" });
    }

    const appt = await Appointment.findById(appointmentId);
    if (!appt) {
      return res.status(404).json({ success: false, status: false, message: "Appointment not found" });
    }

    const payAmount = amount || appt.amount || 500;
    const transactionId = "TXN" + Date.now() + Math.floor(Math.random() * 1000);

    const payment = await Payment.create({
      appointmentId,
      userId: req.user?.id || appt.userId,
      amount: payAmount,
      currency: "INR",
      paymentMethod,
      status: "pending",
      transactionId,
      paymentUrl: `https://payment-gateway.com/pay/${transactionId}`
    });

    res.status(201).json({
      success: true,
      status: true,
      message: "Payment initiated successfully",
      payment
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// Direct pay convenience endpoint (POST /api/payments/pay)
exports.payDirect = async (req, res) => {
  try {
    const appointmentId = req.body.appointmentId || req.body.appointment_id;

    if (!appointmentId) {
      return res.status(400).json({ success: false, status: false, message: "appointmentId required" });
    }

    const appt = await Appointment.findById(appointmentId);
    if (!appt) {
      return res.status(404).json({ success: false, status: false, message: "Appointment not found" });
    }

    appt.status = "confirmed";
    appt.paymentStatus = "paid";
    await appt.save();

    const transactionId = "TXN" + Date.now();
    const payment = await Payment.create({
      appointmentId,
      userId: req.user?.id || appt.userId,
      amount: appt.amount,
      currency: "INR",
      paymentMethod: req.body.paymentMethod || "card",
      status: "completed",
      transactionId
    });

    res.json({
      success: true,
      status: true,
      message: "Payment completed successfully",
      appointment_id: appt._id,
      booking_status: "confirmed",
      payment
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// GET /api/payments/:id
exports.getPaymentStatus = async (req, res) => {
  try {
    // Check if :id is Payment ID or Appointment ID
    let payment = await Payment.findById(req.params.id).populate("appointmentId");
    if (!payment) {
      payment = await Payment.findOne({ appointmentId: req.params.id }).populate("appointmentId");
    }

    if (!payment) {
      // Check appointment directly
      const appt = await Appointment.findById(req.params.id);
      if (!appt) {
        return res.status(404).json({ success: false, status: false, message: "Payment/Appointment not found" });
      }
      return res.json({
        success: true,
        status: true,
        payment: {
          appointmentId: appt._id,
          status: appt.paymentStatus || "unpaid",
          amount: appt.amount
        }
      });
    }

    res.json({
      success: true,
      status: true,
      payment
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// PATCH /api/payments/:id
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status, transactionId } = req.body || {};

    if (!status) {
      return res.status(400).json({ success: false, status: false, message: "status is required" });
    }

    let payment = await Payment.findById(req.params.id);
    if (!payment) {
      payment = await Payment.findOne({ appointmentId: req.params.id });
    }

    if (payment) {
      payment.status = status;
      if (transactionId) payment.transactionId = transactionId;
      await payment.save();

      // If completed, update appointment
      if (status === "completed" || status === "paid") {
        await Appointment.findByIdAndUpdate(payment.appointmentId, {
          status: "confirmed",
          paymentStatus: "paid"
        });
      }

      return res.json({
        success: true,
        status: true,
        message: "Payment status updated",
        payment
      });
    }

    // Otherwise check appointment
    const appt = await Appointment.findById(req.params.id);
    if (!appt) {
      return res.status(404).json({ success: false, status: false, message: "Payment not found" });
    }

    appt.status = status === "completed" ? "confirmed" : "pending";
    appt.paymentStatus = status === "completed" ? "paid" : "unpaid";
    await appt.save();

    res.json({
      success: true,
      status: true,
      message: "Payment status updated",
      payment: { appointmentId: appt._id, status: appt.paymentStatus }
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// DELETE /api/payments/:id - Cancel payment
exports.cancelPayment = async (req, res) => {
  try {
    let payment = await Payment.findById(req.params.id);
    if (payment) {
      payment.status = "cancelled";
      await payment.save();
    }

    await Appointment.findByIdAndUpdate(req.params.id, {
      paymentStatus: "unpaid",
      status: "pending"
    });

    res.json({
      success: true,
      status: true,
      message: "Payment cancelled successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};
