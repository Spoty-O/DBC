import { Outlet } from "react-router";
import BackgroundComponent from "../background/background.component";

const TemplateContainer = () => {
  return (
    <>
      <BackgroundComponent />
      <Outlet />
    </>
  );
};

export default TemplateContainer;
