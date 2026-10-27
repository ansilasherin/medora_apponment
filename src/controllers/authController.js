const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Register
exports.register = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ success: false, status: false, message: "Request body is missing." });
    }

    const { name, email, phone, password, role } = req.body;

    if (!name || !password) {
      return res.status(400).json({ success: false, status: false, message: "name and password required" });
    }

    if (!email && !phone) {
      return res.status(400).json({ success: false, status: false, message: "email or phone is required" });
    }

    // Check for existing user by email
    if (email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ success: false, status: false, message: "Email already exists" });
      }
    }

    // Check for existing user by phone if provided
    if (phone) {
      const existsPhone = await User.findOne({ phone });
      if (existsPhone) {
        return res.status(400).json({ success: false, status: false, message: "Phone number already exists" });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = ["patient", "doctor", "admin"].includes(role) ? role : "patient";

    const user = await User.create({
      ...req.body,
      passwordHash,
      role: assignedRole,
      email: email || "",
      phone: phone || ""
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      status: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ success: false, status: false, message: "Request body is missing." });
    }

    const { email, phone, password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, status: false, message: "password is required" });
    }

    if (!email && !phone) {
      return res.status(400).json({ success: false, status: false, message: "email or phone is required" });
    }

    const query = {};
    if (email) query.email = email;
    if (phone) query.phone = phone;

    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({ success: false, status: false, message: "User not found" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ success: false, status: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role || "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      status: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || "patient"
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};
