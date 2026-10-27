const Appointment = require("../models/Appointment");

exports.startCall = async (req, res) => {
  try {
    const { appointmentId, callType } = req.body; // callType: 'video' or 'audio'

    if (!appointmentId || !callType) {
      return res.status(400).json({
        success: false,
        status: false,
        message: "appointmentId and callType are required"
      });
    }

    if (!["video", "audio"].includes(callType)) {
      return res.status(400).json({
        success: false,
        status: false,
        message: "callType must be 'video' or 'audio'"
      });
    }

    // Verify appointment exists
    const appointment = await Appointment.findById(appointmentId)
      .populate("doctorId")
      .populate("userId")
      .populate("patientId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        status: false,
        message: "Appointment not found"
      });
    }

    const roomId = `room-${appointmentId}`;
    const callData = {
      _id: `call_${appointmentId}_${Date.now()}`,
      callType,
      status: "ongoing",
      startTime: new Date().toISOString(),
      roomId,
      appointmentId,
      startedBy: req.user.id
    };

    res.json({
      success: true,
      status: true,
      message: "Call started successfully",
      call: callData,
      callData
    });

  } catch (err) {
    console.error("Error starting call:", err);
    res.status(500).json({
      success: false,
      status: false,
      message: err.message
    });
  }
};

exports.getCallStatus = async (req, res) => {
  try {
    const param = req.params.callId || req.params.appointmentId;

    let appointment = await Appointment.findById(param)
      .populate("doctorId")
      .populate("userId");

    const doctorName = appointment?.doctorId?.name || "Doctor";
    const patientName = appointment?.patientName || appointment?.userId?.name || "Patient";

    const callStatus = {
      status: "ongoing",
      participants: [
        { name: doctorName, role: "doctor", joinedAt: new Date().toISOString() },
        { name: patientName, role: "patient", joinedAt: new Date().toISOString() }
      ],
      duration: 120,
      appointmentId: appointment?._id || param
    };

    res.json({
      success: true,
      status: true,
      call: callStatus,
      callStatus
    });

  } catch (err) {
    console.error("Error getting call status:", err);
    res.status(500).json({
      success: false,
      status: false,
      message: err.message
    });
  }
};

exports.endCall = async (req, res) => {
  try {
    const param = req.params.callId || req.params.appointmentId;
    const { feedbackRating, feedbackComment } = req.body || {};

    res.json({
      success: true,
      status: true,
      message: "Call ended successfully",
      feedbackRating: feedbackRating || 5,
      feedbackComment: feedbackComment || "",
      callId: param
    });

  } catch (err) {
    console.error("Error ending call:", err);
    res.status(500).json({
      success: false,
      status: false,
      message: err.message
    });
  }
};

exports.getCallHistory = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [
        { userId: req.user.id },
        { patientId: req.user.id },
        { doctorId: req.user.id }
      ]
    })
      .populate("doctorId")
      .populate("slotId")
      .sort({ createdAt: -1 })
      .limit(20);

    const callHistory = appointments.map((appointment) => ({
      appointmentId: appointment._id,
      doctor: appointment.doctorId,
      patient: appointment.patientName,
      status: appointment.status,
      date: appointment.appointmentDate || appointment.slotId?.date,
      time: appointment.slotId?.time
    }));

    res.json({
      success: true,
      status: true,
      callHistory
    });

  } catch (err) {
    console.error("Error getting call history:", err);
    res.status(500).json({
      success: false,
      status: false,
      message: err.message
    });
  }
};