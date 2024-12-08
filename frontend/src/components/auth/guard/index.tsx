import { getAccessToken, getRole } from "@/utils/auth";
import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = (props) => {
   const { requiredRole } = props;
   const userRole = getRole();
   const accessToken = getAccessToken();

   if (!accessToken || accessToken == "") {
      return <Navigate to="/login" />;
   }

   if (userRole !== requiredRole) {
      return <Navigate to="/401" />;
   }

   return <Outlet />;
};

export default AuthGuard;
