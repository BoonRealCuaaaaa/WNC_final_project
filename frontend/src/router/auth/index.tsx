import ForgotPasswordPage from "@/pages/auth/forgot-password";
import LoginPage from "@/pages/auth/login";
import { Navigate, Route, Routes } from "react-router-dom";

const AuthRoutes = () => {
   return (
      <Routes>
         <Route index element={<Navigate to="/login" />} />
         <Route path="login" element={<LoginPage />} />
         <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
   );
};

export default AuthRoutes;
