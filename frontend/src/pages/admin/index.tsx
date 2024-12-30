import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header>
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
      </Header>
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
