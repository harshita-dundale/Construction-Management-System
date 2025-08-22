import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux"; // Import Provider
import { PersistGate } from 'redux-persist/integration/react';
// import { Provider } from 'react-redux';
import { store, persistor }  from "./Pages/Redux/store.js"; // Import your store
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
