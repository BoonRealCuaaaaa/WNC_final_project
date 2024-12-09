import DebitManagementPage from "@/pages/customer/debit-management";
import TestPage from "@/pages/customer/test";
import { Route, Routes } from "react-router-dom";

const CustomerRoutes = () => {
   return (
      <Routes>
         <Route index element={<TestPage />} />
         <Route path="test" element={<TestPage />} />
         <Route path="debit-management" element={<DebitManagementPage />} />
      </Routes>
   );
};

export default CustomerRoutes;
