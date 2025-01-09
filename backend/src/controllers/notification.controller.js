import { models } from "../lib/utils/database/index.js";

export const getNotifications = async (req, res) => {
  const userId = req.user.id;
  const notifications = await models.Notification.findAll({
    include: [
      {
        model: models.Customer,
        as: "customer",
        attributes: ["id", "fullName", "email", "phone"],
        where: { userId },
      },
    ],
  });

  return res.status(200).json(notifications);
};

export const readNotification = async (req, res) => {
  const { id } = req.body;

  const notification = await models.Notification.findOne({
    where: { id },
  });

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  notification.isRead = true;
  await notification.save();

  return res.status(200).json(notification);
};
