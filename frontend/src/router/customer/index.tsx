import DebitManagementPage from "@/pages/customer/debit-management";
import AccountManagementPage from "@/pages/customer/account-management";
import PaymentTransactionPage from "@/pages/customer/transaction-management";
import TestPage from "@/pages/customer/test";
import { Route, Routes } from "react-router-dom";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route index path="account-management" element={<AccountManagementPage />} />
      <Route path="test" element={<TestPage />} />
      <Route path="debit-management" element={<DebitManagementPage />} />
      <Route
        path="transaction-management"
        element={<PaymentTransactionPage />}
      />
    </Routes>
  );
};

export default CustomerRoutes;
