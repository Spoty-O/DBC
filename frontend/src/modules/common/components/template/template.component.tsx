// import HeaderComponent from "../header/header.component";
import type { ITemplateProps } from "../../types";
import BackgroundComponent from "../background/background.component";

const TemplateContainer = ({ component }: ITemplateProps) => {
  return (
    <>
      <BackgroundComponent />
      {/* <HeaderComponent /> */}
      <main>{component}</main>
    </>
  );
};

export default TemplateContainer;
