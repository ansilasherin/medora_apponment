const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  initiatePayment,
  getPaymentStatus,
  updatePaymentStatus,
  cancelPayment
} = require("../controllers/payment.controller");

router.post("/initiate", auth, initiatePayment);
router.get("/:id", auth, getPaymentStatus);
router.patch("/:id", auth, updatePaymentStatus);
router.delete("/:id", auth, cancelPayment);

module.exports = router;
