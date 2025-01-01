import AuthGuard from "@/components/auth/guard";
import { Route, Routes } from "react-router-dom";
import AuthRoutes from "./auth";
import CustomerRoutes from "./customer";
import PageError401 from "@/pages/error/401";
import CustomerLayout from "@/pages/customer";
import AuthLayout from "@/pages/auth";
import AdminLayout from "@/pages/admin";
import TellerLayout from "@/pages/teller";
import TellerRoutes from "./teller";
import AdminRoutes from "./admin";
const AppRouter = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/auth/*" element={<AuthRoutes />} />
      </Route>
      <Route path="/401" element={<PageError401 />} />
      <Route element={<AuthGuard requiredRole="Admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Route>
      </Route>
      <Route element={<AuthGuard requiredRole="Teller" />}>
        <Route element={<TellerLayout />}>
          <Route path="/teller/*" element={<TellerRoutes />} />
        </Route>
      </Route>
      <Route element={<AuthGuard requiredRole="Customer" />}>
        <Route element={<CustomerLayout />}>
          <Route path="/*" element={<CustomerRoutes />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
