import { models } from "../lib/utils/database/index.js";

export const getNotifications = async (req, res) => {
   const userId = req.user.id;
   const notifications = await models.Notification.findAll({
      include: [
         {
            model: models.Customer,
            as: "customer",
            where: { userId },
         },
      ],
   });

   return res.status(200).json(notifications);
};

export const readNotification = async (req, res) => {
   const { id } = req.body;
   const userId = req.user.id;

   const notification = await models.Notification.findOne({
      where: { id },
      include: [
         {
            model: models.Customer,
            as: "customer",
            where: { userId },
         },
      ],
   });

   if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
   }

   notification.read = true;
   await notification.save();

   return res.status(200).json(notification);
};
