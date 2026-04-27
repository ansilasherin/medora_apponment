const Appointment = require("../models/Appointment");

exports.startCall = async (req, res) => {
  try {
    const { appointmentId, callType } = req.body; // callType: 'video' or 'audio'

    if (!appointmentId || !callType) {
      return res.status(400).json({
        status: false,
        message: "appointmentId and callType are required"
      });
    }

    if (!["video", "audio"].includes(callType)) {
      return res.status(400).json({
        status: false,
        message: "callType must be 'video' or 'audio'"
      });
    }

    // Verify appointment exists and user is authorized
    const appointment = await Appointment.findById(appointmentId)
      .populate("doctorId", "name")
      .populate("userId", "name");

    if (!appointment) {
      return res.status(404).json({
        status: false,
        message: "Appointment not found"
      });
    }

    // Check if user is doctor or patient
    const isDoctor = appointment.doctorId._id.toString() === req.user.id;
    const isPatient = appointment.userId._id.toString() === req.user.id;

    if (!isDoctor && !isPatient) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized to start call for this appointment"
      });
    }

    // Check if appointment is confirmed
    if (appointment.status !== "CONFIRMED") {
      return res.status(400).json({
        status: false,
        message: "Appointment must be confirmed before starting a call"
      });
    }

    // Generate call details
    const callData = {
      callId: `call_${appointmentId}_${Date.now()}`,
      appointmentId,
      callType,
      startedBy: req.user.id,
      participants: [
        {
          userId: appointment.doctorId._id,
          role: "doctor",
          name: appointment.doctorId.name,
        },
        {
          userId: appointment.userId._id,
          role: "patient",
          name: appointment.userId.name,
        }
      ],
      startTime: new Date(),
      status: "active",
    };

    res.json({
      status: true,
      message: "Call started successfully",
      callData,
    });

  } catch (err) {
    console.error("Error starting call:", err);
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

exports.getCallStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate("doctorId", "name")
      .populate("userId", "name");

    if (!appointment) {
      return res.status(404).json({
        status: false,
        message: "Appointment not found"
      });
    }

    // Check if user is authorized
    const isDoctor = appointment.doctorId._id.toString() === req.user.id;
    const isPatient = appointment.userId._id.toString() === req.user.id;

    if (!isDoctor && !isPatient) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized to view call status"
      });
    }

    res.json({
      status: true,
      callStatus: {
        appointmentId,
        appointmentStatus: appointment.status,
        doctor: {
          id: appointment.doctorId._id,
          name: appointment.doctorId.name,
        },
        patient: {
          id: appointment.userId._id,
          name: appointment.userId.name,
        },
        canStartCall: appointment.status === "CONFIRMED",
      },
    });

  } catch (err) {
    console.error("Error getting call status:", err);
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

exports.endCall = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        status: false,
        message: "Appointment not found"
      });
    }

    // Check if user is authorized
    const isDoctor = appointment.doctorId.toString() === req.user.id;
    const isPatient = appointment.userId.toString() === req.user.id;

    if (!isDoctor && !isPatient) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized to end call"
      });
    }

    res.json({
      status: true,
      message: "Call end request acknowledged",
      appointmentId,
    });

  } catch (err) {
    console.error("Error ending call:", err);
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

exports.getCallHistory = async (req, res) => {
  try {
    // Get appointments for the user (as patient or doctor)
    const appointments = await Appointment.find({
      $or: [
        { userId: req.user.id },
        { doctorId: req.user.id }
      ],
      status: "CONFIRMED"
    })
    .populate("doctorId", "name consultationFee")
    .populate("slotId", "date time")
    .sort({ createdAt: -1 })
    .limit(20);

    const callHistory = appointments.map(appointment => ({
      appointmentId: appointment._id,
      doctor: {
        id: appointment.doctorId._id,
        name: appointment.doctorId.name,
      },
      patient: {
        id: appointment.userId,
        name: appointment.userId.name,
      },
      date: appointment.slotId.date,
      time: appointment.slotId.time,
      amount: appointment.amount,
      status: appointment.status,
      canCall: true, // Since status is CONFIRMED
    }));

    res.json({
      status: true,
      callHistory,
    });

  } catch (err) {
    console.error("Error getting call history:", err);
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};