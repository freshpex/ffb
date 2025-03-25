import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "/src/css/index.css"
import { BrowserRouter } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Provider } from 'react-redux';
import store from './redux/store';

// AOS animation library
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: false,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </BrowserRouter>
);
