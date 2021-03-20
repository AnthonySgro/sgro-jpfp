import React, { Component } from "react";

// React Router Links
import { Link, NavLink } from "react-router-dom";

const Header = () => {
    return (
        <header id="app-header">
            <div id="header-home">
                <NavLink to="/">Home</NavLink>
            </div>
            <div id="header-links">
                <NavLink to="/campuses">Campuses</NavLink>
                <NavLink to="/students">Students</NavLink>
            </div>
        </header>
    );
};

export default Header;
