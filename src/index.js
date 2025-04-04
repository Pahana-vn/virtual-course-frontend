import React from "react";
import ReactDOM from "react-dom/client";

//Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";

//Font Awesome
import "./assets/icons/fontawesome/css/fontawesome.min.css";
import "./assets/icons/fontawesome/css/all.min.css";

//Box icon
import "./assets/icons/boxicons/css/boxicons.min.css";
import "./index.css";

//CSS
import "./assets/css/style.css";

// Feather
import "./assets/icons/feather/css/iconfont.css";

import Approuter from "./approuter";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Approuter />
        </PersistGate>
      </Provider>
    </React.StrictMode>
  </>
);
