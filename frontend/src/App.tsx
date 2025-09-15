import "./App.css";
import { BrowserRouter } from "react-router";
import PublicRoutes from "./modules/navigation/public.routes";

function App() {
  return (
    <BrowserRouter>
      <PublicRoutes />
    </BrowserRouter>
  );
}

export default App;
