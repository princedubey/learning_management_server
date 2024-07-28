import notificationsModel from "../models/notificationsModel";
import crone from 'node-cron'

// Get all notifications --- admin
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationsModel.find().sort({ created_at: -1 })

    res.status(200).send({
      success: true,
      message: "Notifications fetched successfully",
      data: notifications,
    })
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

// Update notifications status --- admin
export const updateNotification = async (req, res, next) => {
  try {
    const notificationId = req.params.notification_id;

    const notification = await notificationsModel.findByIdAndUpdate(
      notificationId,
      { is_read: true },
      { new: true }
    )

    res.status(200).send({
      success: true,
      message: "Notifications marked as read successfully",
      data: notification,
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

// Delete notification with help of node-crone --- admin
crone.schedule('0 0 0 * * *', async () => {
  try {
    // last 30 days read data need to be deleted
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await notificationsModel.deleteMany({ is_read: true, created_at: { $lt: thirtyDaysAgo } })

  } catch (error) {
    console.error(error.message);
    throw error.message;
  }
})