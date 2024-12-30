import TellerManagementPage from "@/pages/admin/teller-management";
import TransactionHistoryPage from "@/pages/admin/transaction-history";
import { Route, Routes } from "react-router-dom";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<TellerManagementPage />} />
      <Route path="transaction-history" element={<TransactionHistoryPage />} />
    </Routes>
  );
};

export default AdminRoutes;
