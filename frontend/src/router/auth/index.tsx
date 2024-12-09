import LoginPage from "@/pages/auth/login";
import { Route, Routes } from "react-router-dom";

const AuthRoutes = () => {
   return (
      <Routes>
         <Route index element={<LoginPage />} />
      </Routes>
   );
};

export default AuthRoutes;
