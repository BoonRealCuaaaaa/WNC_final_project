import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { NavLink, Outlet } from "react-router-dom";

const TellerLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header>
        <NavLink
          to="/teller"
          className={({ isActive }) =>
            isActive ? "nav-link-active" : "nav-link-inactive"
          }
        >
          Quản lý tài khoản khách hàng
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

export default TellerLayout;
