const User = require("../models/User");

// GET /api/users - List all users (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-passwordHash")
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      status: true,
      users,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// GET /api/users/profile - Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ success: false, status: false, message: "User not found" });
    }

    res.json({
      success: true,
      status: true,
      user
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// PUT /api/users/profile - Update own profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, dateOfBirth, gender, address, profilePic, phone } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
    if (gender) updates.gender = gender;
    if (address) updates.address = address;
    if (profilePic) updates.profilePic = profilePic;
    if (phone) updates.phone = phone;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    res.json({
      success: true,
      status: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// DELETE /api/users/:userId - Delete user (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, status: false, message: "User not found" });
    }

    res.json({
      success: true,
      status: true,
      message: "User deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};
