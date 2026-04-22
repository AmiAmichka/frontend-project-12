import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignupPage from "./pages/SignupPage";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/', element: <ChatPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

export default router;