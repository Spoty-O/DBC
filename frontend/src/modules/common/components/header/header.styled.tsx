import styled from "styled-components";
import HeaderComponent from "./header.component";

export const Header = styled(HeaderComponent)`
  display: flex;
  width: 100%;
  height: 70px;
  justify-content: center;
  align-items: center;
  background-color: #303036;
  position: sticky;
  top: 0;
  border-bottom: 1px solid #242424;
  z-index: 2;
  .container {
    display: flex;
    flex-direction: row;
    max-width: 1200px;
    width: 100%;
    align-items: center;
    height: 100%;
    justify-content: center;
  }
  .header-text {
    font-size: 20px;
    color: white;
    cursor: pointer;
    text-transform: uppercase;
  }
`;
