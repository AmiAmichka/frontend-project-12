import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('authToken');
  return isAuth ? children : <Navigate to="/login" replace />;
};