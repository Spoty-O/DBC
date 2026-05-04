import { IBasicProps } from "../../common/types";
import { SchemaGeneratorPage } from "../../schema-generator/pages/SchemaGeneratorPage";

interface IProps extends IBasicProps {}

const MainPageContainer = ({ className }: IProps) => {
  return <SchemaGeneratorPage className={className} />;
};

export default MainPageContainer;
