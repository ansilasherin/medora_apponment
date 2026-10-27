const router = require("express").Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/role");
const {
  getSlotsByDoctor,
  createSlot,
  getSlotById,
  updateSlot,
  deleteSlot
} = require("../controllers/slot.controller");

// Public endpoints
router.get("/doctor/:doctorId", getSlotsByDoctor);
router.get("/:id", getSlotById);

// Protected endpoints (Doctor or Admin)
router.post("/", auth, authorize("doctor", "admin"), createSlot);
router.patch("/:id", auth, authorize("doctor", "admin"), updateSlot);
router.put("/:id", auth, authorize("doctor", "admin"), updateSlot);
router.delete("/:id", auth, authorize("admin", "doctor"), deleteSlot);

module.exports = router;
