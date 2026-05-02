/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { useStaff } from "../../common/hooks";
import { IBasicProps } from "../../common/types";
import { useStaffStore } from "../../store/staff.store";
import { text } from "../../common/consts";

interface IProps extends IBasicProps {}
const MainPageContainer = ({ className }: IProps) => {
  useStaff();
  const { staff } = useStaffStore();

  return (
    <div className={className}>
      <div className="main-container"></div>
    </div>
  );
};

export default MainPageContainer;
