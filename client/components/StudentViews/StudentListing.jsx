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
            allStudents: props.allStudents,
            displayedStudents: props.displayedStudents,
            splicedStudents: [],
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
        // Load students
        await this.props.loadAllStudents();

        const { allStudents, displayedStudents } = this.props;
        // Receive current page if a query was attatched to url
        const currentPage = this.parseQuery();

        // Get displayed students
        const splicedStudents = this.sliceDisplayedStudents(
            currentPage,
            displayedStudents,
        );

        const maxPageCount = Math.ceil(displayedStudents.length / 10);

        // Set all students
        this.setState({
            ...this.state,
            allStudents,
            displayedStudents,
            splicedStudents,
            currentPage,
            loading: false,
            maxPageCount,
        });
    }

    // Making sure our local state matches the redux store
    componentDidUpdate(prevProps, prevState) {
        const { allStudents, displayedStudents } = this.props;

        // If our redux store changed something in the display
        if (prevState.displayedStudents !== displayedStudents) {
            // Splice students again accordingly
            const splicedStudents = this.sliceDisplayedStudents(
                prevState.currentPage,
                displayedStudents,
            );

            // Save the state
            this.setState(
                {
                    ...this.state,
                    allStudents,
                    displayedStudents,
                    splicedStudents,
                    maxPageCount: Math.ceil(displayedStudents.length / 10),
                    loading: false,
                },
                () => {
                    // State is updating asynchronously, and is called after the render
                    // We have to force an update to re-render the page once the
                    // Update is processed. Idk if this is bad but I think it is working
                    this.forceUpdate();
                },
            );
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

    sliceDisplayedStudents(currentPage, students) {
        // Displayed students slicing
        const start = currentPage * 10 - 10;
        const end = currentPage * 10;

        // Return a segment of the all students block
        return students.slice(start, end);
    }

    // Handles pagination clicks
    handlePageClick(data) {
        // Redirect to clicked page
        const page = parseInt(data.selected) + 1;

        const displayedStudents = this.sliceDisplayedStudents(
            page,
            this.state.displayedStudents,
        );

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
            splicedStudents,
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
                                    {allStudents ? (
                                        // If there are students, render cards
                                        <div className="main-view-listings-container">
                                            <ReactPaginate
                                                previousLabel={"prev"}
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
                                                {splicedStudents.map(
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
