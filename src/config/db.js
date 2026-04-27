const mongoose = require("mongoose");

module.exports = async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    // Connection options optimized for production/Render
    const options = {
      retryWrites: true,
      w: "majority",
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };

    console.log("🔄 Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoURI, options);

    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Database: ${mongoose.connection.db.databaseName || "mydb"}`);
    console.log(`🌐 Connection ready state: ${mongoose.connection.readyState}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });

    return mongoose.connection;

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("❌ Please check:");
    console.error("  - MONGO_URI is correctly set in environment variables");
    console.error("  - MongoDB Atlas IP whitelist includes 0.0.0.0/0 (allow all)");
    console.error("  - Database user has read/write permissions");
    throw error;
  }
};
