import { Route, Routes } from "react-router-dom";
import CustomerManagementPage from "@/pages/teller/customer-management";
import CustomerTransactionManagementPage from "@/pages/teller/customer-transaction";

const TellerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CustomerManagementPage />} />
      <Route
        path="/transactions/:id"
        element={<CustomerTransactionManagementPage />}
      />
    </Routes>
  );
};

export default TellerRoutes;
