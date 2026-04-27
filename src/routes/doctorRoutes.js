const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
} = require("../controllers/doctor.controller");
const { createSlotsForDoctor, getSlotsByDoctorAndDate } = require("../controllers/slot.controller");

router.post("/", auth, createDoctor);
router.get("/", auth, getDoctors);
router.get("/:id", auth, getDoctorById);
router.put("/:id", auth, updateDoctor);
router.patch("/:id", auth, updateDoctor);
router.delete("/:id", auth, deleteDoctor);

router.post("/:id/slots", auth, createSlotsForDoctor);
router.get("/:id/slots", auth, getSlotsByDoctorAndDate);

module.exports = router;
