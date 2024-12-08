import { Toaster } from "../shared/toaster";
import LeftPanel from "./left-panel";
import LoginTabs from "./login-form";

const Login = () => {
   return (
      <>
         <div className="flex flex-row h-screen w-screen">
            <LeftPanel className={"w-1/2"} />
            <LoginTabs />
         </div>
         <Toaster/>
      </>
   );
};

export default Login;
