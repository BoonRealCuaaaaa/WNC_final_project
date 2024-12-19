import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { NavLink, Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header>
        <NavLink
          to="/account-management"
          className={({ isActive }) =>
            isActive ? "nav-link-active" : "nav-link-inactive"
          }
        >
          Quản lý tài khoản
        </NavLink>
        <NavLink
          to="/abc"
          className={({ isActive }) =>
            isActive ? "nav-link-active" : "nav-link-inactive"
          }
        >
          Chuyển khoản
        </NavLink>
        <NavLink
          to="/debit-management"
          className={({ isActive }) =>
            isActive ? "nav-link-active" : "nav-link-inactive"
          }
        >
          Quản lý nhắc nợ
        </NavLink>
        <NavLink
          to="/transaction-management"
          className={({ isActive }) =>
            isActive ? "nav-link-active" : "nav-link-inactive"
          }
        >
          Lịch sử giao dịch
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

export default CustomerLayout;
