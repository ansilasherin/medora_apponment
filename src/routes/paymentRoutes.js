const router = require("express").Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/role");
const {
  getAllPayments,
  initiatePayment,
  payDirect,
  getPaymentStatus,
  updatePaymentStatus,
  cancelPayment
} = require("../controllers/payment.controller");

router.get("/", auth, authorize("admin"), getAllPayments);
router.post("/initiate", auth, initiatePayment);
router.post("/pay", auth, payDirect); // Convenience direct payment
router.get("/:id", auth, getPaymentStatus);
router.patch("/:id", auth, updatePaymentStatus);
router.delete("/:id", auth, cancelPayment);

module.exports = router;
