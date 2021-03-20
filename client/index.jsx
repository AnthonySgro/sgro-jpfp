import React, { Component } from "react";
import ReactDom from "react-dom";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <h1>Hello World</h1>;
    }
}

ReactDom.render(<App></App>, document.querySelector("#app"));
