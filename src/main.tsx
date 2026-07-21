import { createRoot } from "react-dom/client";
import "@aws-amplify/ui-react/styles.css";
import "./amplify-config";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
