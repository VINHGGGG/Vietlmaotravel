import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { BASE_URL } from "./utils/config";
import { AuthContextProvider } from "./context/AuthContext";

// Bật gửi cookie với mọi request để backend verify admin qua JWT
axios.defaults.withCredentials = true;
axios.defaults.baseURL = BASE_URL;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider> {}
        <App />
    </AuthContextProvider>
  </React.StrictMode>
);