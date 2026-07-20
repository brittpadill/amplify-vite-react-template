import { createRoot } from "react-dom/client";
import "./amplify-config";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
