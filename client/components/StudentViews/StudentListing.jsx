import React, { Component } from "react";

// Redux imports
import { connect } from "react-redux";
import { fetchAllStudents } from "../../store/student.js";

// Router & Query Imports
import { withRouter } from "react-router";
import queryString from "query-string";

// Component Imports
import StudentCard from "../Cards/StudentCard.jsx";
import Sidebar from "../Sidebar.jsx";
import Loading from "../Loading.jsx";
import StudentListingHeader from "../ListingHeaders/StudentListingHeader.jsx";

// NPM Imports
import ReactPaginate from "react-paginate";

class StudentListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allStudents: [],
            displayedStudents: [],
            currentPage: 1,
            loading: true,
            maxPageCount: 1,
        };
        this.handlePageClick = this.handlePageClick.bind(this);
        this.sliceDisplayedStudents = this.sliceDisplayedStudents.bind(this);
        this.parseQuery = this.parseQuery.bind(this);
    }

    // We want to get all the students when we go to this page
    async componentDidMount() {
        // Receive current page if a query was attatched to url
        const currentPage = this.parseQuery();

        // Get displayed students
        const displayedStudents = this.sliceDisplayedStudents(currentPage);

        // Calculate max page count with students prop
        const maxPageCount = Math.ceil(this.props.students.length / 10);

        // I know this doesn't do anything now, it's just here for
        // the cool loading screen. Does help make component look
        // nice if the array mapping takes a while
        await this.props.loadAllStudents();

        // Set all students
        this.setState({
            ...this.state,
            allStudents: this.props.students,
            displayedStudents,
            loading: false,
            maxPageCount,
            currentPage,
        });
    }

    // Ensuring our state mirrors the passed down props
    componentDidUpdate(prevProps, prevState) {
        if (prevState.allStudents !== this.props.students) {
            const { currentPage } = this.state;

            // Reupdate max page count
            const maxPageCount = Math.ceil(this.props.students.length / 10);

            // Update student
            this.setState({
                ...this.state,
                allStudents: this.props.students,
                displayedStudents: this.sliceDisplayedStudents(currentPage),
                maxPageCount,
            });
        }
    }

    // Parses url queries
    parseQuery() {
        // Parses initial query if exists
        const reqQuery = this.props.location.search;
        const params = queryString.parse(reqQuery);

        // If a request query was passed, set that to the current page, else 1
        const currentPage = reqQuery ? parseInt(params.page) : 1;

        // If invalid query, return with the first page
        if (!currentPage) {
            return 1;
        }

        return currentPage;
    }

    sliceDisplayedStudents(currentPage) {
        // Displayed students slicing
        const start = currentPage * 10 - 10;
        const end = currentPage * 10;

        // Return a segment of the all students block
        return this.props.students.slice(start, end);
    }

    // Handles pagination clicks
    handlePageClick(data) {
        // Redirect to clicked page
        const page = parseInt(data.selected) + 1;

        const displayedStudents = this.sliceDisplayedStudents(page);

        // Set clicked page to state
        this.setState(
            {
                ...this.state,
                currentPage: page,
                displayedStudents,
            },
            () => {
                // Redirect to clicked page
                this.props.history.push(`/students?page=${page}`);
            },
        );
    }

    render() {
        const {
            loading,
            currentPage,
            allStudents,
            displayedStudents,
            maxPageCount,
        } = this.state;

        return (
            <React.Fragment>
                <StudentListingHeader />
                <div className="main-listing-view">
                    <div className="main-view-chunk">
                        <Sidebar student={true} />
                        <div className="main-view-list-campus">
                            {/* Displays loading page if loading */}
                            {loading ? (
                                <Loading />
                            ) : (
                                <React.Fragment>
                                    <h2>All Students</h2>
                                    {allStudents.length ? (
                                        // If there are students, render cards
                                        <div className="main-view-listings-container">
                                            <ReactPaginate
                                                previousLabel={"previous"}
                                                nextLabel={"next"}
                                                breakLabel={"..."}
                                                pageCount={maxPageCount}
                                                marginPagesDisplayed={1}
                                                pageRangeDisplayed={3}
                                                onPageChange={
                                                    this.handlePageClick
                                                }
                                                containerClassName={
                                                    "pagination"
                                                }
                                                forcePage={currentPage - 1}
                                                activeClassName={"active"}
                                            />
                                            <div className="main-view-listings">
                                                {displayedStudents.map(
                                                    (student) => (
                                                        <StudentCard
                                                            key={student.id}
                                                            {...student}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        // If there are no campuses, display this message
                                        <React.Fragment>
                                            <div className="main-view-listings-container">
                                                There are no students registered
                                                in the database
                                            </div>
                                        </React.Fragment>
                                    )}
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        allStudents: state.studentInfo.allStudents,
        displayedStudents: state.studentInfo.displayedStudents,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadAllStudents: () => dispatch(fetchAllStudents()),
    };
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(StudentListing),
);
