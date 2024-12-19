import { Separator } from "@/components/ui/separator";
import { Avatar } from "antd";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex flex-row justify-between py-6 px-9">
        <div className="flex flex-row space-x-6 items-center">
          <NavLink
            to=""
            end
            className={({ isActive }) =>
              isActive ? "font-medium text-black" : "text-primary-gray"
            }
          >
            Quản lý giao dịch viên
          </NavLink>
          <NavLink
            to="transaction-history"
            className={({ isActive }) =>
              isActive ? "font-medium text-black" : "text-primary-gray"
            }
          >
            Danh sách giao dịch
          </NavLink>
        </div>
        <div className="flex flex-row space-x-3 items-center">
          <div className="flex flex-col items-end">
            <p className="text-sm text-primary-gray">Quản trị viên</p>
            <p className="text-base font-medium">Nguyễn Văn A</p>
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

export default AdminLayout;
