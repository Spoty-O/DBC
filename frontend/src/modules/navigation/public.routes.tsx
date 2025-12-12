import { Navigate, Route, Routes } from "react-router";
import TemplateContainer from "../common/components/template/template.component";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TemplateContainer component={<>asdasda</>} />} />
      <Route path="*" element={<Navigate to={"/"} replace />} />
    </Routes>
  );
};

export default PublicRoutes;
