import AuthGuard from "@/components/auth/guard";
import { Route, Routes } from "react-router-dom";
import AuthRoutes from "./auth";
import CustomerRoutes from "./customer";
import PageError401 from "@/pages/error/401";
import CustomerLayout from "@/pages/customer";
import AuthLayout from "@/pages/auth";
import AdminLayout from "@/pages/admin";
import EmployeeManagementPage from "@/pages/admin/employee-management";
import TransactionHistory from "@/pages/admin/transaction-history";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/auth/*" element={<AuthRoutes />} />
      </Route>
      <Route path="/401" element={<PageError401 />} />
      <Route element={<AuthGuard requiredRole="Customer" />}>
        <Route element={<CustomerLayout />}>
          <Route path="/*" element={<CustomerRoutes />} />
        </Route>
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<EmployeeManagementPage />} />
        <Route path="transaction-history" element={<TransactionHistory />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
