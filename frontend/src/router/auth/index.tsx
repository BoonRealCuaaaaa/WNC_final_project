import LoginPage from "@/pages/login";
import { Route, Routes } from "react-router-dom";

const AuthRoutes = () => {
   return (
      <Routes>
         <Route index element={<LoginPage />} />
      </Routes>
   );
};

export default AuthRoutes;
