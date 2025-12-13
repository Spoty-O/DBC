import { Navigate, Route, Routes } from "react-router";
import TemplateContainer from "../common/components/template/template.component";
import AuthPage from "../pages/auth/auth.page";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<TemplateContainer />}>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<></>} />
      </Route>
      {/* <Route path="*" element={<Navigate to={"/"} replace />} /> */}
    </Routes>
  );
};

export default PublicRoutes;
