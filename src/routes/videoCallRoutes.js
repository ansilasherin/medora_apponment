const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  startCall,
  getCallStatus,
  endCall,
  getCallHistory
} = require("../controllers/videoCall.controller");

router.post("/start", auth, startCall);
router.get("/status/:appointmentId", auth, getCallStatus);
router.get("/:callId/status", auth, getCallStatus);
router.post("/end/:appointmentId", auth, endCall);
router.post("/:callId/end", auth, endCall);
router.get("/history", auth, getCallHistory);

module.exports = router;