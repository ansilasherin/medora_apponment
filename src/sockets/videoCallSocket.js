const jwt = require("jsonwebtoken");
const Appointment = require("../models/Appointment");

// Store active calls and users
const activeCalls = new Map(); // callId -> { participants: [], roomId, callType }
const connectedUsers = new Map(); // userId -> socketId

module.exports = (io) => {
  io.use((socket, next) => {
    // Authenticate socket connection
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication token required"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userEmail = decoded.email;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.userId} connected with socket ${socket.id}`);

    // Store user connection
    connectedUsers.set(socket.userId, socket.id);

    // Join user's personal room for direct messaging
    socket.join(`user_${socket.userId}`);

    // Handle user joining a call room
    socket.on("join-call", async (data) => {
      try {
        const { appointmentId, callType } = data; // callType: 'video' or 'audio'

        // Verify appointment exists and user is authorized
        const appointment = await Appointment.findById(appointmentId)
          .populate("doctorId", "name")
          .populate("userId", "name");

        if (!appointment) {
          socket.emit("error", { message: "Appointment not found" });
          return;
        }

        // Check if user is doctor or patient
        const isDoctor = appointment.doctorId._id.toString() === socket.userId;
        const isPatient = appointment.userId._id.toString() === socket.userId;

        if (!isDoctor && !isPatient) {
          socket.emit("error", { message: "Unauthorized to join this call" });
          return;
        }

        const roomId = `call_${appointmentId}`;
        socket.join(roomId);

        // Initialize or update call data
        if (!activeCalls.has(appointmentId)) {
          activeCalls.set(appointmentId, {
            participants: [],
            roomId,
            callType,
            appointmentId,
            startTime: new Date(),
          });
        }

        const callData = activeCalls.get(appointmentId);
        const participant = {
          userId: socket.userId,
          socketId: socket.id,
          role: isDoctor ? "doctor" : "patient",
          name: isDoctor ? appointment.doctorId.name : appointment.userId.name,
          joinedAt: new Date(),
        };

        // Remove existing participant if reconnecting
        callData.participants = callData.participants.filter(p => p.userId !== socket.userId);
        callData.participants.push(participant);

        // Notify other participants
        socket.to(roomId).emit("participant-joined", {
          participant,
          callData: {
            callType,
            participants: callData.participants,
            startTime: callData.startTime,
          },
        });

        // Send current call state to the joining user
        socket.emit("call-joined", {
          callData: {
            callType,
            participants: callData.participants,
            startTime: callData.startTime,
            roomId,
          },
        });

        console.log(`User ${socket.userId} joined call ${appointmentId}`);

      } catch (error) {
        console.error("Error joining call:", error);
        socket.emit("error", { message: "Failed to join call" });
      }
    });

    // Handle WebRTC signaling
    socket.on("offer", (data) => {
      const { targetUserId, offer, appointmentId } = data;
      const targetSocketId = connectedUsers.get(targetUserId);

      if (targetSocketId) {
        io.to(targetSocketId).emit("offer", {
          from: socket.userId,
          offer,
          appointmentId,
        });
      }
    });

    socket.on("answer", (data) => {
      const { targetUserId, answer, appointmentId } = data;
      const targetSocketId = connectedUsers.get(targetUserId);

      if (targetSocketId) {
        io.to(targetSocketId).emit("answer", {
          from: socket.userId,
          answer,
          appointmentId,
        });
      }
    });

    socket.on("ice-candidate", (data) => {
      const { targetUserId, candidate, appointmentId } = data;
      const targetSocketId = connectedUsers.get(targetUserId);

      if (targetSocketId) {
        io.to(targetSocketId).emit("ice-candidate", {
          from: socket.userId,
          candidate,
          appointmentId,
        });
      }
    });

    // Handle call controls
    socket.on("toggle-mute", (data) => {
      const { appointmentId, muted } = data;
      const roomId = `call_${appointmentId}`;

      socket.to(roomId).emit("participant-muted", {
        userId: socket.userId,
        muted,
      });
    });

    socket.on("toggle-video", (data) => {
      const { appointmentId, videoOff } = data;
      const roomId = `call_${appointmentId}`;

      socket.to(roomId).emit("participant-video-off", {
        userId: socket.userId,
        videoOff,
      });
    });

    socket.on("end-call", (data) => {
      const { appointmentId } = data;
      const roomId = `call_${appointmentId}`;

      // Remove participant from call
      if (activeCalls.has(appointmentId)) {
        const callData = activeCalls.get(appointmentId);
        callData.participants = callData.participants.filter(p => p.userId !== socket.userId);

        // If no participants left, end the call
        if (callData.participants.length === 0) {
          activeCalls.delete(appointmentId);
        } else {
          // Notify remaining participants
          io.to(roomId).emit("participant-left", {
            userId: socket.userId,
            callEnded: false,
          });
        }
      }

      socket.leave(roomId);
      socket.emit("call-ended", { appointmentId });
    });

    // Handle chat messages during call
    socket.on("send-message", (data) => {
      const { appointmentId, message } = data;
      const roomId = `call_${appointmentId}`;

      io.to(roomId).emit("new-message", {
        from: socket.userId,
        message,
        timestamp: new Date(),
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${socket.userId} disconnected`);

      // Remove from connected users
      connectedUsers.delete(socket.userId);

      // Handle call cleanup
      for (const [appointmentId, callData] of activeCalls.entries()) {
        const participantIndex = callData.participants.findIndex(p => p.userId === socket.userId);
        if (participantIndex !== -1) {
          callData.participants.splice(participantIndex, 1);

          // If no participants left, end the call
          if (callData.participants.length === 0) {
            activeCalls.delete(appointmentId);
          } else {
            // Notify remaining participants
            io.to(callData.roomId).emit("participant-left", {
              userId: socket.userId,
              callEnded: false,
            });
          }
          break;
        }
      }
    });
  });
};