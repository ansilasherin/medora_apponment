const Chat = require("../models/Chat");
const User = require("../models/User");

// POST /api/chat/send
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, message, appointmentId } = req.body;

    if (!recipientId || !message) {
      return res.status(400).json({ success: false, status: false, message: "recipientId and message are required" });
    }

    const chatMessage = await Chat.create({
      senderId: req.user.id,
      recipientId,
      appointmentId: appointmentId || null,
      message: message.trim(),
      isRead: false
    });

    const populatedMessage = await Chat.findById(chatMessage._id)
      .populate("senderId", "name email profilePic role")
      .populate("recipientId", "name email profilePic role");

    res.status(201).json({
      success: true,
      status: true,
      message: "Message sent successfully",
      chatMessage: populatedMessage
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// GET /api/chat/history/:recipientId
exports.getChatHistory = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const { page = 1, limit = 50, appointmentId } = req.query;

    const currentUserId = req.user.id;
    const filter = {
      $or: [
        { senderId: currentUserId, recipientId },
        { senderId: recipientId, recipientId: currentUserId }
      ]
    };

    if (appointmentId) {
      filter.appointmentId = appointmentId;
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [messages, total] = await Promise.all([
      Chat.find(filter)
        .populate("senderId", "name email profilePic role")
        .populate("recipientId", "name email profilePic role")
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limitNum),
      Chat.countDocuments(filter)
    ]);

    res.json({
      success: true,
      status: true,
      messages,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// GET /api/chat/conversations
exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Find all chats involving current user
    const chats = await Chat.find({
      $or: [{ senderId: currentUserId }, { recipientId: currentUserId }]
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "name email profilePic role")
      .populate("recipientId", "name email profilePic role");

    // Group by conversation partner
    const conversationMap = new Map();

    for (const chat of chats) {
      const isSender = chat.senderId?._id?.toString() === currentUserId.toString();
      const partner = isSender ? chat.recipientId : chat.senderId;

      if (!partner || !partner._id) continue;
      const partnerId = partner._id.toString();

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          conversationPartner: partner,
          lastMessage: chat.message,
          lastMessageAt: chat.createdAt,
          unreadCount: 0
        });
      }

      // Count unread messages where current user is the recipient
      if (!isSender && !chat.isRead) {
        conversationMap.get(partnerId).unreadCount++;
      }
    }

    res.json({
      success: true,
      status: true,
      conversations: Array.from(conversationMap.values())
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// POST /api/chat/mark-read
exports.markAsRead = async (req, res) => {
  try {
    const { senderId } = req.body;
    const currentUserId = req.user.id;

    const filter = { recipientId: currentUserId, isRead: false };
    if (senderId) filter.senderId = senderId;

    await Chat.updateMany(filter, { $set: { isRead: true } });

    res.json({
      success: true,
      status: true,
      message: "Messages marked as read"
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// GET /api/chat/unread-count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Chat.countDocuments({
      recipientId: req.user.id,
      isRead: false
    });

    res.json({
      success: true,
      status: true,
      unreadCount: count
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// GET /api/chat/search
exports.searchMessages = async (req, res) => {
  try {
    const { query, recipientId } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, status: false, message: "query is required" });
    }

    const currentUserId = req.user.id;
    const filter = {
      message: { $regex: query, $options: "i" },
      $or: [{ senderId: currentUserId }, { recipientId: currentUserId }]
    };

    if (recipientId) {
      filter.$and = [
        {
          $or: [
            { senderId: currentUserId, recipientId },
            { senderId: recipientId, recipientId: currentUserId }
          ]
        }
      ];
    }

    const messages = await Chat.find(filter)
      .populate("senderId", "name email profilePic")
      .populate("recipientId", "name email profilePic")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      status: true,
      messages
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};

// DELETE /api/chat/message/:messageId
exports.deleteMessage = async (req, res) => {
  try {
    const msg = await Chat.findOneAndDelete({
      _id: req.params.messageId,
      senderId: req.user.id
    });

    if (!msg) {
      return res.status(404).json({ success: false, status: false, message: "Message not found or unauthorized" });
    }

    res.json({
      success: true,
      status: true,
      message: "Message deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, status: false, message: err.message });
  }
};
