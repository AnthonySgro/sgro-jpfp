import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import {
    searchStudentListing,
    sortStudentListing,
    filterStudentListing,
} from "../store/student";
import {
    searchCampusListing,
    sortCampusListing,
    filterCampusListing,
} from "../store/campus";

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
            filtering: {
                parameter: "",
                active: false,
            },
        };
        this.highlightAdder = this.highlightAdder.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.toggleSortDropdown = this.toggleSortDropdown.bind(this);
        this.toggleFilterDropdown = this.toggleFilterDropdown.bind(this);
        this.sorting = this.sorting.bind(this);
        this.filtering = this.filtering.bind(this);
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

    toggleSortDropdown() {
        document.getElementById("filter-dropdown").classList.remove("show");
        document.getElementById("sort-dropdown").classList.toggle("show");
    }

    toggleFilterDropdown() {
        document.getElementById("sort-dropdown").classList.remove("show");
        document.getElementById("filter-dropdown").classList.toggle("show");
    }

    // Handles sorting
    sorting(str) {
        const { sorting } = this.state;

        // True is ascending (default)
        // False is descending (default for numerical categories)
        let order =
            str === "gpa" || str === "studentCount" || str === "id"
                ? false
                : true;

        // If we clicked the same sort button again, reverse order
        if (sorting.parameter === str) {
            order = Boolean(!sorting.order);
        }

        // Set state
        this.setState(
            {
                ...this.state,
                sorting: {
                    parameter: str,
                    order,
                },
            },
            () => {
                // Dispatch actions
                const { parameter, order } = this.state.sorting;
                if (this.props.student) {
                    this.props.sortStudents(parameter, order);
                } else {
                    this.props.sortCampuses(parameter, order);
                }
            },
        );
    }

    // Handles filtering
    filtering(str) {
        const { filtering } = this.state;

        // If you click, we are now filtering
        let active = true;

        // Unless you clicked the same button, then we are toggling
        if (filtering.parameter === str) {
            active = Boolean(!filtering.active);
        }

        // Set state
        this.setState(
            {
                ...this.state,
                filtering: {
                    parameter: str,
                    active,
                },
            },
            () => {
                // Dispatch actions
                const { parameter, active } = this.state.filtering;
                if (this.props.student) {
                    this.props.filterStudents(parameter, active);
                } else {
                    this.props.filterCampuses(parameter, active);
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
                                onClick={this.toggleSortDropdown}
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
                                    <a
                                        onClick={() =>
                                            this.sorting("studentCount")
                                        }
                                    >
                                        Student Count
                                    </a>
                                </div>
                            )}
                            <button
                                onClick={this.toggleFilterDropdown}
                                className="sort-btn add-btn"
                            >
                                Filter
                            </button>
                            {student ? (
                                // Student Filtering Options
                                <div
                                    id="filter-dropdown"
                                    className="dropdown-content"
                                >
                                    <a
                                        onClick={() =>
                                            this.filtering("notEnrolled")
                                        }
                                    >
                                        Not Enrolled
                                    </a>
                                </div>
                            ) : (
                                // Campus Filtering Options
                                <div
                                    id="filter-dropdown"
                                    className="dropdown-content"
                                >
                                    <a
                                        onClick={() =>
                                            this.filtering("noStudents")
                                        }
                                    >
                                        No Students
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
        filterStudents: (str, active) =>
            dispatch(filterStudentListing(str, active)),
        filterCampuses: (str, active) =>
            dispatch(filterCampusListing(str, active)),
    };
}

export default connect(null, mapDispatchToProps)(Sidebar);
