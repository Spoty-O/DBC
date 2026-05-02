import styled from "styled-components";
import MainPageContainer from "./main.page";

export const MainPage = styled(MainPageContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  .main-container {
    display: flex;
    width: 100%;
    max-width: 1200px;
    flex-direction: column;
    align-items: center;
  }
`;
