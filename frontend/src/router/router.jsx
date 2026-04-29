import { LoginPage } from "../pages/LoginPage";
import ChatPage from "../pages/ChatPage";
import NotFoundPage from "../pages/NotFoundPage";
import { SignupPage } from "../pages/SignupPage";
import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/', element: <ProtectedRoute><ChatPage /></ProtectedRoute> },
  { path: '*', element: <NotFoundPage /> },
]);

export default router;