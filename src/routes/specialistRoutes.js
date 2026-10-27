const router = require("express").Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/role");

const {
  getAllSpecialists,
  getSpecialistById,
  createSpecialist,
  updateSpecialist,
  deleteSpecialist
} = require("../controllers/specialist.controller");

// Public endpoints
router.get("/", getAllSpecialists);
router.get("/:id", getSpecialistById);

// Admin-only endpoints
router.post("/", auth, authorize("admin"), createSpecialist);
router.put("/:id", auth, authorize("admin"), updateSpecialist);
router.patch("/:id", auth, authorize("admin"), updateSpecialist);
router.delete("/:id", auth, authorize("admin"), deleteSpecialist);

module.exports = router;
