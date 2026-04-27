const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment
} = require("../controllers/appointment.controller");
const { getAppointmentPDF } = require("../controllers/pdf.controller");

router.post("/", auth, createAppointment);
router.post("/create", auth, createAppointment);
router.get("/", auth, getAppointments);
router.get("/:id", auth, getAppointment);
router.put("/:id", auth, updateAppointment);
router.patch("/:id", auth, updateAppointment);
router.delete("/:id", auth, deleteAppointment);
router.get("/:id/pdf", auth, getAppointmentPDF);

module.exports = router;