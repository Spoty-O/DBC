import { Route, Routes } from "react-router";
import AuthPage from "../pages/auth/auth.page";
import BackgroundLayout from "@common/components/template/background.layout.component";
import RegisterPage from "../pages/auth/register.page";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<BackgroundLayout />}>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<></>} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
