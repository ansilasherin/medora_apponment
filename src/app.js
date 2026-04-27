const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const specialistRoutes = require("./routes/specialistRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const slotRoutes = require("./routes/slotRoutes");
const videoCallRoutes = require("./routes/videoCallRoutes");

const app = express();

// CORS (good for Flutter + future Flutter web)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: true, message: "API is running" });
});

// Routes
app.get("/api", (req, res) => {
  res.json({ status: true, message: "API root working" });
});
app.use("/api/auth", authRoutes);
app.use("/api/specialists", specialistRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/calls", videoCallRoutes);

module.exports = app;
