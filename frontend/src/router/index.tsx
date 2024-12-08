import AuthGuard from "@/components/auth/guard";
import { Route, Routes } from "react-router-dom";
import AuthRoutes from "./auth";
import CustomerRoutes from "./customer";
import PageError401 from "@/pages/error/401";

const AppRouter = () => {
   return (
      <Routes>
         <Route path="/login" element={<AuthRoutes />} />
         <Route path="/401" element={<PageError401 />} />
         <Route element={<AuthGuard requiredRole="Customer" />}>
            <Route path="/" element={<CustomerRoutes />} />
         </Route>
      </Routes>
   );
};

export default AppRouter;
