import React from "react";
import ReactDom from "react-dom";

// Redux Imports
import { Provider } from "react-redux";
import store from "./store";

// Component Imports
import App from "./components/App.jsx";

ReactDom.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector("#app"),
);
