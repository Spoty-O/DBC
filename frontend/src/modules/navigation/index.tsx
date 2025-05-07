import PublicRoutes from "./public.routes";
import { Header } from "../common/components/header";

export const MainRouter = () => {
  return (
    <>
      <Header />
      <PublicRoutes />
    </>
  );
};
