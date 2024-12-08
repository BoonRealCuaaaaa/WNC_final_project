import TestPage from "@/pages/test";
import { Route, Routes } from "react-router-dom";

const CustomerRoutes = () => {
   return (
      <Routes>
         <Route index element={<TestPage />} />
      </Routes>
   );
};

export default CustomerRoutes;
