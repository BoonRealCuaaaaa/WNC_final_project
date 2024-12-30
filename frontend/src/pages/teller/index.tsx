import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Outlet } from "react-router-dom";

const TellerLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header></Header>
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
