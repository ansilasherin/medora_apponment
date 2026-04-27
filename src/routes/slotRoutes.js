const router = require("express").Router();
const auth = require("../middleware/auth");
const { getSlotById, updateSlot, deleteSlot } = require("../controllers/slot.controller");

router.get("/:id", auth, getSlotById);
router.put("/:id", auth, updateSlot);
router.patch("/:id", auth, updateSlot);
router.delete("/:id", auth, deleteSlot);

module.exports = router;
