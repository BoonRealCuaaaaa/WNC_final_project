import { cn } from "@/lib/utils";
import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import avatarImage from "@/assets/avatar.jpg";
import { Description } from "../ui/description";
import { Link } from "react-router-dom";

const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
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
          <Link to="/auth/login">
            <Avatar>
              <AvatarImage src={avatarImage} />
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
});

export default Header;
