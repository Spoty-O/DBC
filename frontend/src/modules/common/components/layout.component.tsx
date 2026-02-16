import { Outlet } from "react-router";
import SceneComponent from "./scene.component";

const Layout = () => {
  return (
    <>
      <SceneComponent />
      <main className="z-10 flex h-full w-full items-center justify-center">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
