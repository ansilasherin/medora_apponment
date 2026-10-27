const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  sendMessage,
  getChatHistory,
  getConversations,
  markAsRead,
  getUnreadCount,
  searchMessages,
  deleteMessage
} = require("../controllers/chat.controller");

router.use(auth); // All chat routes require authentication

router.post("/send", sendMessage);
router.get("/conversations", getConversations);
router.get("/unread-count", getUnreadCount);
router.get("/search", searchMessages);
router.post("/mark-read", markAsRead);
router.get("/history/:recipientId", getChatHistory);
router.delete("/message/:messageId", deleteMessage);

module.exports = router;
