import { getAccessToken, getRole } from "@/utils/auth";
import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = (props) => {
  const { requiredRole } = props;
  const userRole = getRole();
  const accessToken = getAccessToken();

  if (!accessToken || accessToken == "") {
    return <Navigate to="/auth/login" />;
  }

  console.log(userRole);
  console.log(requiredRole);
  if (userRole.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/401" />;
  }

  return <Outlet />;
};

export default AuthGuard;
