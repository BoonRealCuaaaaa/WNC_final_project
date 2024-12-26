import DebitManagementPage from "@/pages/customer/debit-management";
import AccountManagementPage from "@/pages/customer/account-management";
import PaymentTransactionPage from "@/pages/customer/transaction-management";
import { Navigate, Route, Routes } from "react-router-dom";
import ChangePassword from "@/components/change-password";
import BankingPage from "@/pages/customer/banking";
import BankingConfimationPage from "@/pages/customer/banking/banking-confirm";
import BankingResultPage from "@/pages/customer/banking/banking-result";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="account-management" />} />
      <Route path="account-management" element={<AccountManagementPage />} />
      <Route path="banking" >
        <Route index element={<BankingPage />}/>
        <Route path="confirm" element={<BankingConfimationPage />}/>
        <Route path="result" element={<BankingResultPage />}/>
      </Route>
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
