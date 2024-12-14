import React, { useEffect, useRef } from "react";
import { Badge, Popover, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotificationsApi } from "@/api/notification.api";
import { Separator } from "@/components/shared/separator";
import { connectSocket, onNotify } from "@/shared/lib/services/socket";

const NotificationBell = () => {
   const queryClient = useQueryClient();
   const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
      queryKey: ["notifications"],
      queryFn: getNotificationsApi,
   });

   const socketInitialized = useRef(false);

   // Socket connection
   useEffect(() => {
      if (!socketInitialized.current) {
         connectSocket();

         onNotify((data) => {
            console.log(data);
            queryClient.setQueryData(["notifications"], (oldData: { data: { id: string; title: string; message: string; isRead: boolean; }[] }) => {
               return {
                  ...oldData,
                  data: [data, ...oldData.data],
               };
            });
         });

         socketInitialized.current = true;
      }
   }, [queryClient]);

   const markAllAsRead = () => {
      console.log("Mark all as read");
   };

   const handleNotificationClick = (id) => {
      console.log(`Notification ${id} clicked`);
   };

   if (isLoadingNotifications) return <div>Loading...</div>;

   const unreadCount = notifications.data.filter((notif) => !notif.read).length;

   const content = (
      <div className="w-60 bg-purple-50 border border-purple-200 rounded-lg shadow-lg">
         <ul className="max-h-64 overflow-auto">
            {notifications.data.map((item) => (
               <li
                  key={item.id}
                  className={`p-3 border-b ${
                     item.read ? "bg-white" : "bg-purple-100 hover:bg-purple-200"
                  } cursor-pointer transition-all duration-200`}
                  onClick={() => handleNotificationClick(item.id)}>
                  <h4 className="font-bold text-purple-800">{item.title}</h4>
                  <p className="text-purple-700 text-sm">{item.message}</p>
               </li>
            ))}
         </ul>
      </div>
   );

   return (
      <Popover
         content={content}
         title={
            <div className=" flex flex-col justify-between ">
               <span className="font-bold text-xl pb-1">Thông báo</span>
               <Separator />
               <Button type="link" onClick={markAllAsRead} className="text-sm  hover:underline self-end">
                  Đánh dấu đã đọc tất cả
               </Button>
            </div>
         }
         trigger="click"
         placement="bottomLeft"
         overlayClassName="rounded-lg shadow-lg">
         <Badge count={unreadCount} offset={[0, 0]}>
            <BellOutlined className=" text-2xl cursor-pointer hover:scale-110 transition-transform" />
         </Badge>
      </Popover>
   );
};

export default NotificationBell;