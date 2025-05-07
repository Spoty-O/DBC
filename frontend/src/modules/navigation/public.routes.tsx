import { Navigate, Route, Routes } from "react-router-dom";
import { MainPage } from "../pages/main";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="*" element={<Navigate to={"/"} replace />} />
    </Routes>
  );
};

export default PublicRoutes;
