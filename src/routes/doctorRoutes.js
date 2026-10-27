const router = require("express").Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/role");

const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
} = require("../controllers/doctor.controller");
const { createSlotsForDoctor, getSlotsByDoctorAndDate } = require("../controllers/slot.controller");

// Public endpoints
router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/slots", getSlotsByDoctorAndDate); // Legacy & convenient doctor slots

// Admin endpoints
router.post("/", auth, authorize("admin"), createDoctor);
router.delete("/:id", auth, authorize("admin"), deleteDoctor);

// Admin or Doctor endpoints
router.put("/:id", auth, updateDoctor);
router.patch("/:id", auth, updateDoctor);
router.post("/:id/slots", auth, createSlotsForDoctor);

module.exports = router;
