import Notification from '../Models/Notification.js';

export const addStatusHistory = (job, status, note, userId, role) => {
  if (!job.statusHistory) job.statusHistory = [];
  job.statusHistory.push({
    status,
    note: note || `Job ${status}`,
    by: userId,
    role: role || 'system',
    at: new Date(),
  });
  job.status = status;
};

export const createNotification = async ({ userId, userRole, type, title, message, link, jobId }) => {
  try {
    await Notification.create({ userId, userRole, type, title, message, link, jobId });
  } catch (err) {
    console.error('Notification error:', err);
  }
};

export const notifyJobParties = async (job, { type, title, message, excludeId }) => {
  const parties = [
    { id: job.hirer?.toString(), role: 'hirer' },
    { id: job.tasker?.toString(), role: 'tasker' },
  ].filter((p) => p.id && p.id !== excludeId);

  await Promise.all(
    parties.map((p) =>
      createNotification({
        userId: p.id,
        userRole: p.role,
        type,
        title,
        message,
        link: `/profile/tasks`,
        jobId: job._id,
      })
    )
  );
};
