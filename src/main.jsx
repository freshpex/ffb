import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store";
import { AuthContextProvider } from "./components/AuthPage/AuthContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import "./css/tailwind.css";
import "./css/darkmode.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthContextProvider>
          <DarkModeProvider>
            <App />
          </DarkModeProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
