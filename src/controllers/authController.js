const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Register (for testing)
exports.register = async (req, res) => {
     console.log("CONTENT-TYPE:", req.headers["content-type"]);
     console.log("BODY:", req.body);
  try {
    if (!req.body) {
      return res.status(400).json({ status: false, message: "Request body is missing. Please provide user data." });
    }

    const { name, email, phone, password } = req.body;
    console.log("CONTENT-TYPE:", req.headers["content-type"]);
     console.log("BODY:", req.body);

    if (!name || !password) {
      return res.status(400).json({ status: false, message: "name and password required" });
    }

    if (!email && !phone) {
      return res.status(400).json({ status: false, message: "email or phone is required" });
    }

    // Check for existing user by email or phone
    const existingQuery = {};
    if (email) existingQuery.email = email;
    if (phone) existingQuery.phone = phone;

    const exists = await User.findOne(existingQuery);
    if (exists) {
      const conflictField = exists.email === email ? "email" : "phone";
      return res.status(400).json({ status: false, message: `${conflictField} already exists` });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const createData = { ...req.body, passwordHash };
    delete createData.password;
    createData.email = email || "";
    createData.phone = phone || "";

    const user = await User.create(createData);

    res.json({
      status: true,
      message: "Registered",
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ✅ Login (main)
exports.login = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ status: false, message: "Request body is missing. Please provide credentials." });
    }

    const { email, phone, password } = req.body;

    if (!password) {
      return res.status(400).json({ status: false, message: "password is required" });
    }

    if (!email && !phone) {
      return res.status(400).json({ status: false, message: "email or phone is required" });
    }

    // Find user by email or phone
    const query = {};
    if (email) query.email = email;
    if (phone) query.phone = phone;

    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({ status: false, message: "User not found" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ status: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      status: true,
      message: "Login success",
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
