import instance from "@/utils/axios";

export const getNotificationsApi = () => {
   return instance.get("/notification");
};
