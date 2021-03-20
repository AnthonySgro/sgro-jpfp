import React, { Component } from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";

import store from "./store";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Provider store={store}>
                <h1>Hello World</h1>
            </Provider>
        );
    }
}

ReactDom.render(<App></App>, document.querySelector("#app"));
