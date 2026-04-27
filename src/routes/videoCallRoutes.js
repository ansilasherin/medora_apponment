const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  startCall,
  getCallStatus,
  endCall,
  getCallHistory
} = require("../controllers/videoCall.controller");

// Start a video/audio call
router.post("/start", auth, startCall);

// Get call status for an appointment
router.get("/status/:appointmentId", auth, getCallStatus);

// End a call
router.post("/end/:appointmentId", auth, endCall);

// Get call history for the user
router.get("/history", auth, getCallHistory);

module.exports = router;