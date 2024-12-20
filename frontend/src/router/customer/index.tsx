import DebitManagementPage from "@/pages/customer/debit-management";
import AccountManagementPage from "@/pages/customer/account-management";
import PaymentTransactionPage from "@/pages/customer/transaction-management";
import TestPage from "@/pages/customer/test";
import { Navigate, Route, Routes } from "react-router-dom";
import ChangePassword from "@/components/change-password";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="account-management" />} />
      <Route path="account-management" element={<AccountManagementPage />} />
      <Route path="test" element={<TestPage />} />
      <Route path="debit-management" element={<DebitManagementPage />} />
      <Route
        path="transaction-management"
        element={<PaymentTransactionPage />}
      />
      <Route path="/change-password" element={<ChangePassword />} />
    </Routes>
  );
};

export default CustomerRoutes;
