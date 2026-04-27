require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const http = require("http");
const socketIo = require("socket.io");
const videoCallSocket = require("./src/sockets/videoCallSocket");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// Initialize video call socket handlers
videoCallSocket(io);

connectDB()
  .then(() => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.io initialized for real-time communication`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });
