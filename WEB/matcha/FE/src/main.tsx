import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@/assets/css/reset.css";
import { CookiesProvider } from "react-cookie";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <RecoilRoot>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </RecoilRoot>
  // </React.StrictMode>
);
