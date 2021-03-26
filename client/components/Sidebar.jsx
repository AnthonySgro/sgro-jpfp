import React, { Component } from "react";

// Component Imports
import StudentAdd from "./Forms/StudentAdd.jsx";
import CampusAdd from "./Forms/CampusAdd.jsx";

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.highlightAdder = this.highlightAdder.bind(this);
    }

    highlightAdder() {
        const container = document.querySelectorAll(".container");
        container[0].classList.add("container-highlighted");
    }

    render() {
        const { removeAdder, student, highlightAdder } = this.props;
        return (
            <React.Fragment>
                {student ? (
                    <StudentAdd removeAdder={removeAdder} />
                ) : (
                    <CampusAdd removeAdder={removeAdder} />
                )}
                <nav className="main-view-sidebar">
                    <h2>Menu</h2>
                    <button
                        className="add-btn add-after-listings"
                        onClick={this.highlightAdder}
                    >
                        {student ? "Enroll Student" : "Build Campus"}
                    </button>
                </nav>
            </React.Fragment>
        );
    }
}

export default Sidebar;
