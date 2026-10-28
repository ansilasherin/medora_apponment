const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  deleteAppointment
} = require("../controllers/appointment.controller");
const { getAppointmentPDF } = require("../controllers/pdf.controller");

router.post("/", auth, createAppointment);
router.post("/create", auth, createAppointment);
router.get("/", auth, getAppointments);
router.get("/:id", auth, getAppointment);
router.put("/:id", auth, updateAppointment);
router.patch("/:id", auth, cancelAppointment); // Cancel appointment with reason
router.delete("/:id", auth, deleteAppointment);
router.get("/:id/pdf", getAppointmentPDF); // Public route for slip PDF download via browser

module.exports = router;