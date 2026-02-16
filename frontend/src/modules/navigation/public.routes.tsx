import { Route, Routes } from "react-router";
import Layout from "@common/components/layout.component";
import AuthPage from "../pages/auth/auth.page";
import RegisterPage from "../pages/auth/register.page";
import ChatPage from "../pages/chat/chat.page";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<></>} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
