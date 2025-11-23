import "./template.style.scss";
import type { ITemplatePageProps } from "../../types";
import HeaderComponent from "../header/header.component";
import BackgroundComponent from "../background/background.component";

const TemplateContainer = ({ component }: ITemplatePageProps) => {
  return (
    <>
      <BackgroundComponent />
      <HeaderComponent />
      <main>{component}</main>
    </>
  );
};

export default TemplateContainer;
