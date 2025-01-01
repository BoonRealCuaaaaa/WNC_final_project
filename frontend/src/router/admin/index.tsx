import AddPartnerPage from "@/pages/admin/add-partner";
import TellerManagementPage from "@/pages/admin/teller-management";
import TransactionHistoryPage from "@/pages/admin/transaction-history";
import { Route, Routes } from "react-router-dom";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<TellerManagementPage />} />
      <Route path="transaction-history" element={<TransactionHistoryPage />} />
      <Route path="add-partner" element={<AddPartnerPage />} />
    </Routes>
  );
};

export default AdminRoutes;
