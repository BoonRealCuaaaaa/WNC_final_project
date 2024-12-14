import instance from "@/utils/axios";

export const getNotificationsApi = () => {
   return instance.get("/notification");
};

export const readNotificationApi = (id) =>{
   return instance.post("/notification/read", {id});
}