import NotificationBell from "@/components/customer/notification";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "antd";
import { NavLink, Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex flex-row justify-between py-6 px-96">
        <div className="flex flex-row space-x-6 items-center">
          <NavLink
            to="/abc"
            className={({ isActive }) =>
              isActive ? "font-medium text-black" : "text-primary-gray"
            }
          >
            Quản lý tài khoản
          </NavLink>
          <NavLink
            to="/abc"
            className={({ isActive }) =>
              isActive ? "font-medium text-black" : "text-primary-gray"
            }
          >
            Chuyển khoản
          </NavLink>
          <NavLink
            to="/debit-management"
            className={({ isActive }) =>
              isActive ? "font-medium text-black" : "text-primary-gray"
            }
          >
            Quản lý nhắc nợ
          </NavLink>
          <NavLink
            to="/transaction-management"
            className={({ isActive }) =>
              isActive ? "font-medium text-black" : "text-primary-gray"
            }
          >
            Lịch sử giao dịch
          </NavLink>
          <NavLink
            to="/test"
            className={({ isActive }) =>
              isActive ? "font-medium text-black" : "text-primary-gray"
            }
          >
            Test Page
          </NavLink>
        </div>
        <div className="flex flex-row space-x-3 items-center">
          <div className="mx-5">
            <NotificationBell />
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm text-primary-gray">Khách hàng</p>
            <p className="text-base font-medium">Nguyễn Trọng Đại</p>
          </div>
          <Avatar
            src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
            className="bg-gray-200"
            size={"large"}
          />
        </div>
      </header>
      <Separator />
      <main className="flex justify-center flex-1">
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CustomerLayout;
