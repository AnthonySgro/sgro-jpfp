import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import { searchStudentListing, sortStudentListing } from "../store/student";
import { searchCampusListing, sortCampusListing } from "../store/campus";

// Component Imports
import StudentAdd from "./Forms/StudentAdd.jsx";
import CampusAdd from "./Forms/CampusAdd.jsx";

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: "",
            sorting: {
                parameter: "",
                order: true,
            },
        };
        this.highlightAdder = this.highlightAdder.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.sorting = this.sorting.bind(this);
    }

    highlightAdder() {
        const container = document.querySelectorAll(".container");
        container[0].classList.add("container-highlighted");
    }

    handleSearch(ev) {
        // Controlled form
        this.setState(
            {
                ...this.state,
                [ev.target.name]: ev.target.value,
            },
            // Invoke search function
            () => {
                // If we are in the student list
                if (this.props.student) {
                    this.props.searchStudents(ev.target.value);
                } else {
                    this.props.searchCampuses(ev.target.value);
                }
            },
        );
    }

    toggleDropdown() {
        document.getElementById("sort-dropdown").classList.toggle("show");
    }

    // Handles sorting
    sorting(str) {
        const { sorting } = this.state;

        // True is ascending (default), false is descending
        // If sorting by GPA, default is false
        let order = str === "gpa" ? false : true;

        // If we clicked the same sort button again, reverse order
        if (sorting.parameter === str) {
            order = Boolean(!sorting.order);
        }

        this.setState(
            {
                ...this.state,
                sorting: {
                    parameter: str,
                    order,
                },
            },
            () => {
                const { parameter, order } = this.state.sorting;
                if (this.props.student) {
                    this.props.sortStudents(parameter, order);
                } else {
                    this.props.sortCampuses(parameter, order);
                }
            },
        );
    }

    render() {
        const { removeAdder, student } = this.props;
        const { searchInput } = this.state;

        return (
            <React.Fragment>
                {student ? (
                    <StudentAdd removeAdder={removeAdder} />
                ) : (
                    <CampusAdd removeAdder={removeAdder} />
                )}
                <nav className="main-view-sidebar">
                    <h2>Menu</h2>
                    <div className="sidebar-body">
                        <button
                            className="add-btn add-after-listings"
                            onClick={this.highlightAdder}
                        >
                            {student ? "Enroll Student" : "Build Campus"}
                        </button>
                        <div className="search-container">
                            <input
                                type="text"
                                name={"searchInput"}
                                value={searchInput}
                                placeholder="Search..."
                                onChange={this.handleSearch}
                            />
                        </div>
                        <div className="dropdown">
                            <button
                                onClick={this.toggleDropdown}
                                className="sort-btn add-btn"
                            >
                                Sort
                            </button>

                            {student ? (
                                // Student Sorting Options
                                <div
                                    id="sort-dropdown"
                                    className="dropdown-content"
                                >
                                    <a onClick={() => this.sorting("id")}>
                                        Date Created
                                    </a>
                                    <a
                                        onClick={() =>
                                            this.sorting("firstName")
                                        }
                                    >
                                        First Name
                                    </a>
                                    <a onClick={() => this.sorting("lastName")}>
                                        Last Name
                                    </a>
                                    <a onClick={() => this.sorting("gpa")}>
                                        GPA
                                    </a>
                                </div>
                            ) : (
                                // Campus Sorting Options
                                <div
                                    id="sort-dropdown"
                                    className="dropdown-content"
                                >
                                    <a onClick={() => this.sorting("id")}>
                                        Date Created
                                    </a>
                                    <a onClick={() => this.sorting("name")}>
                                        Name
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        searchStudents: (str) => dispatch(searchStudentListing(str)),
        searchCampuses: (str) => dispatch(searchCampusListing(str)),
        sortStudents: (str, order) => dispatch(sortStudentListing(str, order)),
        sortCampuses: (str, order) => dispatch(sortCampusListing(str, order)),
    };
}

export default connect(null, mapDispatchToProps)(Sidebar);
