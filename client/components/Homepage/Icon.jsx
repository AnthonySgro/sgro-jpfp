import React, { Component } from "react";

class Icon extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { type, size, filename } = this.props;

        return (
            <img className={`${type + " " + size}`} src={filename} alt="icon" />
        );
    }
}

export default Icon;
