import LeftPanel from "@/components/login/left-panel";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex flex-row h-screen w-screen">
      <LeftPanel className={"w-1/2"} />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
