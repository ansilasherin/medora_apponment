const router = require("express").Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/role");
const {
  getAllUsers,
  getProfile,
  updateProfile,
  deleteUser
} = require("../controllers/user.controller");

// Profile routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

// Admin user management routes
router.get("/", auth, authorize("admin"), getAllUsers);
router.delete("/:userId", auth, authorize("admin"), deleteUser);

module.exports = router;
