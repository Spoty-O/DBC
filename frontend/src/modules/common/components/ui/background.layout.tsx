import { Outlet } from "react-router";
import BackgroundComponent from "../background/background.component";

const BackgroundLayout = () => {
  return (
    <>
      <BackgroundComponent />
      <main className="flex h-full w-full items-center justify-center z-10">
        <Outlet />
      </main>
    </>
  );
};

export default BackgroundLayout;
