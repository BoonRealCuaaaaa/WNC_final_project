import { cn } from "@/lib/utils";
import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import avatarImage from "@/assets/avatar.jpg";
import { Description } from "../ui/description";
import { Navigate, useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import { removeTokens } from "@/utils/auth";

const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const navigate = useNavigate();

  const onLogout = () => {
    removeTokens();
    navigate("/auth/login");
  };

  const items = [
    {
      key: "change-password",
      label: (
        <div onClick={() => navigate("/change-password")}>Đổi mật khẩu</div>
      ),
    },
    {
      key: "logout",
      danger: true,
      label: <div onClick={onLogout}>Đăng xuất</div>,
    },
  ];

  return (
    <header
      ref={ref}
      className={cn("flex justify-center items-center h-16", className)}
      {...props}
    >
      <div className="flex justify-between items-center page-content">
        <div className="flex-1" id="nav-bar">
          {children}
        </div>
        <div className="flex items-center gap-x-4">
          <div className="flex flex-col gap-y-1 items-end">
            <Description>Khách hàng</Description>
            <div className="font-medium text-[14px]/[14px]">Nguyễn Văn A</div>
          </div>
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Avatar>
              <AvatarImage src={avatarImage} />
            </Avatar>
          </Dropdown>
        </div>
      </div>
    </header>
  );
});

export default Header;
