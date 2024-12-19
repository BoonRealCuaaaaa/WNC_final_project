import EmployeeManagementPage from "@/pages/admin/employee-management";
import TransactionHistory from "@/pages/admin/transaction-history";
import { Route, Routes } from "react-router-dom";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<EmployeeManagementPage />} />
      <Route path="transaction-history" element={<TransactionHistory />} />
    </Routes>
  );
};

export default AdminRoutes;
