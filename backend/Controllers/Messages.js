import Message from '../Models/message.js';
import Hirer from '../Models/User.js';
import Tasker from '../Models/Tasker.js';
import { createNotification } from '../utils/jobHelpers.js';

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    const partnerIds = new Set();
    messages.forEach((m) => {
      const pid = m.senderId.toString() === userId ? m.receiverId.toString() : m.senderId.toString();
      partnerIds.add(pid);
    });

    const conversations = [];
    for (const pid of partnerIds) {
      const thread = await Message.find({
        $or: [
          { senderId: userId, receiverId: pid },
          { senderId: pid, receiverId: userId },
        ],
      }).sort({ createdAt: 1 });

      const last = thread[thread.length - 1];
      const hirer = await Hirer.findById(pid).select('fullName profilePicture');
      const tasker = await Tasker.findById(pid).select('fullName profilePicture skills');
      const partner = hirer || tasker;
      if (!partner) continue;

      conversations.push({
        partnerId: pid,
        partner: {
          fullName: partner.fullName,
          profilePicture: partner.profilePicture,
          role: hirer ? 'hirer' : 'tasker',
          skills: tasker?.skills,
        },
        lastMessage: last?.message,
        lastAt: last?.createdAt,
        unread: thread.filter((m) => m.receiverId.toString() === userId && m.status !== 'read').length,
        messages: thread,
      });
    }

    conversations.sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt));
    return res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.error('getConversations Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getThread = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      { senderId: partnerId, receiverId: userId, status: { $ne: 'read' } },
      { status: 'read' }
    );

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('getThread Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message, jobId } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Receiver and message required' });
    }

    const msg = await Message.create({
      senderId,
      receiverId,
      job: jobId || null,
      message: message.trim(),
      status: 'sent',
    });

    const receiverRole = req.user.role === 'hirer' ? 'tasker' : 'hirer';
    await createNotification({
      userId: receiverId,
      userRole: receiverRole,
      type: 'message',
      title: 'New Message',
      message: message.trim().slice(0, 80),
      link: '/messages',
    });

    return res.status(201).json({ success: true, message: msg });
  } catch (error) {
    console.error('sendMessage Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { getConversations, getThread, sendMessage };
