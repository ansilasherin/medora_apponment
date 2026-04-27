require("dotenv").config();

// Validate critical environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI not defined in environment variables");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET not defined in environment variables");
  process.exit(1);
}

const app = require("./src/app");
const connectDB = require("./src/config/db");
const http = require("http");
const socketIo = require("socket.io");
const videoCallSocket = require("./src/sockets/videoCallSocket");

// Use Render's PORT or fallback to 5000
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io with Render-compatible CORS
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Support both for better compatibility
});

// Initialize video call socket handlers
videoCallSocket(io);

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    const serverInstance = server.listen(PORT, HOST, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Host: ${HOST}`);
      console.log(`✅ Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`✅ Socket.io initialized for real-time communication`);
    });

    // Handle server errors
    serverInstance.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error("❌ Server error:", err.message);
      }
      process.exit(1);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("📌 SIGTERM received, shutting down gracefully...");
      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("📌 SIGINT received, shutting down gracefully...");
      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    console.error("❌ Make sure MONGO_URI is correct and MongoDB Atlas is accessible");
    process.exit(1);
  });
