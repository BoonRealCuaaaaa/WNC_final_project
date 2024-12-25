import React, { useEffect, useRef } from "react";
import { Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationsApi,
  readNotificationApi,
} from "@/api/notification.api";
import { Separator } from "@/components/ui/separator";
import { connectSocket, onNotify } from "@/shared/lib/services/socket";
import { Check2 } from "react-bootstrap-icons";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const NotificationBell = () => {
  const queryClient = useQueryClient();
  const {
    data: notifications,
    isLoading: isLoadingNotifications,
    refetch: refetchNotification,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotificationsApi,
  });

  const { mutate: readNotification } = useMutation({
    mutationFn: readNotificationApi,
    onSuccess: () => {
      refetchNotification();
    },
  });

  const socketInitialized = useRef(false);

  // Socket connection
  useEffect(() => {
    if (!socketInitialized.current) {
      connectSocket();

      onNotify((data) => {
        console.log(data);
        queryClient.setQueryData(
          ["notifications"],
          (oldData: {
            data: {
              id: string;
              title: string;
              message: string;
              isRead: boolean;
            }[];
          }) => {
            return {
              ...oldData,
              data: [data, ...oldData.data],
            };
          }
        );
      });

      socketInitialized.current = true;
    }
  }, [queryClient]);

  const markAllAsRead = () => {
    console.log("Mark all as read");
    notifications.data.forEach((notif) => {
      if (!notif.isRead) {
        readNotification(notif.id);
      }
    });
  };

  const handleNotificationClick = (id) => {
    readNotification(id);
  };

  if (isLoadingNotifications) return <div>Loading...</div>;

  const unreadCount = notifications.data.filter(
    (notif) => !notif.isRead
  ).length;

  const content = (
    <div className="w-full bg-purple-50 rounded-lg">
      <ul className="max-h-64 overflow-auto">
        {notifications.data
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((item) => (
            <li
              key={item.id}
              className={`flex items-center justify-between p-3 border-b ${
                item.isRead ? "bg-white" : "bg-purple-100 hover:bg-purple-200"
              } cursor-pointer transition-all duration-200`}
            >
              <div
                onClick={() => handleNotificationClick(item.id)}
                className="flex-1"
              >
                <h4 className="font-bold text-purple-800">{item.title}</h4>
                <p className="text-purple-700 text-sm">{item.message}</p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Badge count={unreadCount} offset={[0, 0]}>
            <BellOutlined className="text-2xl cursor-pointer hover:scale-110 transition-transform" />
          </Badge>
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <div className="flex flex-col justify-between">
              <span className="font-bold text-xl pb-1">Thông báo</span>
              <Separator />
            </div>
            {content}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default NotificationBell;
