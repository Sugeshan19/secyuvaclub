import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const loginPath = role === "admin" ? "/admin/login" : "/login";

  if (!token) {
    return <Navigate to={loginPath} replace />;
  }

  if (role && role !== userRole) {
    return <Navigate to={loginPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
