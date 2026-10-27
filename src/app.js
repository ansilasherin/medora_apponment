const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const specialistRoutes = require("./routes/specialistRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const slotRoutes = require("./routes/slotRoutes");
const videoCallRoutes = require("./routes/videoCallRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// CORS configuration (good for Flutter + web clients + Render)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files
app.use(express.static("public"));

// Request logging middleware (useful for debugging on Render)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Health check endpoint (Render uses this to verify app is running)
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// Root API endpoint
app.get("/api", (req, res) => {
  res.json({
    success: true,
    status: true,
    message: "Doctor Appointment API root working",
    version: "1.0.0",
  });
});

// Routes matching API_Documentation.md
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/specialists", specialistRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/calls", videoCallRoutes);
app.use("/api/chat", chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    status: false,
    message: "Route not found",
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    status: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
});

module.exports = app;
