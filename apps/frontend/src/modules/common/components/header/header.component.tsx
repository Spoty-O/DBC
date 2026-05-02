/* eslint-disable @typescript-eslint/no-empty-object-type */
import { useNavigate } from "react-router-dom";
import { text } from "../../consts";
import { IBasicProps } from "../../types/props.types";
import { useCallback } from "react";

interface IProps extends IBasicProps {}

const HeaderComponent = ({ className }: IProps) => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate("/");
  }, [navigate]);
  return (
    <header className={className} onClick={handleClick}>
      <div className="container">
        <p className="header-text">{text.header}</p>
      </div>
    </header>
  );
};

export default HeaderComponent;
