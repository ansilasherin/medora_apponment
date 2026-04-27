const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  getAllSpecialists,
  getSpecialistById,
  createSpecialist,
  updateSpecialist,
  deleteSpecialist
} = require("../controllers/specialist.controller");

router.get("/", auth, getAllSpecialists);
router.get("/:id", auth, getSpecialistById);
router.post("/", auth, createSpecialist);
router.put("/:id", auth, updateSpecialist);
router.patch("/:id", auth, updateSpecialist);
router.delete("/:id", auth, deleteSpecialist);

module.exports = router;
