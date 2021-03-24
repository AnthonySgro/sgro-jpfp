import React, { Component } from "react";

// React Router Links
import { Link, NavLink } from "react-router-dom";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <header id="app-header">
                <div id="header-home">
                    <NavLink to="/">UniBase.</NavLink>
                </div>
                <div id="header-links">
                    <NavLink to="/campuses" className="header-link">
                        Campuses
                    </NavLink>
                    <NavLink to="/students" className="header-link">
                        Students
                    </NavLink>
                    <NavLink to="/about-us" id="about-us">
                        About Us
                    </NavLink>
                </div>
            </header>
        );
    }
}

export default Header;
