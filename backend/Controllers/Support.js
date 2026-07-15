import SupportTicket from '../Models/SupportTicket.js';

const createTicket = async (req, res) => {
  try {
    const { name, email, phone, subject, message, priority } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const ticket = await SupportTicket.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      priority: priority || 'medium',
      userId: req.user?.id || null,
      userRole: req.user?.role || 'guest',
    });

    return res.status(201).json({ success: true, message: 'Ticket submitted!', ticket });
  } catch (error) {
    console.error('createTicket Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, tickets });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { status, adminReply, priority } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (adminReply) updates.adminReply = adminReply;
    if (priority) updates.priority = priority;

    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, updates, { new: true });
    return res.status(200).json({ success: true, ticket });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { createTicket, getAllTickets, updateTicket };
