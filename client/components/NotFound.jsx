import React, { Component } from "react";

class NotFound extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="not-found-screen">
                <div className="not-found-container">
                    <img src="/images/frown.png" alt="" />
                    <h1 className="not-found-title">404</h1>
                    <h3 className="not-found-subtitle">Page not found...</h3>
                </div>
            </div>
        );
    }
}

export default NotFound;
