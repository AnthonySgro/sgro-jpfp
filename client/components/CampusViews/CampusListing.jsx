import React, { Component } from "react";

// Redux imports
import { connect } from "react-redux";
import { fetchAllCampuses } from "../../store/campus";

// Router & Query Imports
import { withRouter } from "react-router";
import queryString from "query-string";

// Component Imports
import CampusCard from "../Cards/CampusCard.jsx";
import Sidebar from "../Sidebar.jsx";
import Loading from "../Loading.jsx";
import CampusListingHeader from "../ListingHeaders/CampusListingHeader.jsx";

// NPM Imports
import ReactPaginate from "react-paginate";

class CampusListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allCampuses: [],
            displayedCampuses: [],
            loading: true,
            currentPage: 1,
            maxPageCount: 1,
        };
        this.handlePageClick = this.handlePageClick.bind(this);
        this.sliceDisplayedCampuses = this.sliceDisplayedCampuses.bind(this);
        this.parseQuery = this.parseQuery.bind(this);
    }

    // We want to get all the students when this page mounts
    async componentDidMount() {
        // Receive current page if a query was attatched to url
        const currentPage = this.parseQuery();

        // Get displayed students
        const displayedCampuses = this.sliceDisplayedCampuses(currentPage);

        // Calculate max page count with campuses prop
        const maxPageCount = Math.ceil(this.props.campuses.length / 10);

        // I know this doesn't do anything now, it's just here for
        // the cool loading screen. Does help make component look
        // nice if the array mapping takes a while. Works better
        // for the student listings component
        await this.props.loadAllCampuses();

        this.setState({
            allCampuses: this.props.campuses,
            displayedCampuses,
            loading: false,
            maxPageCount,
            currentPage,
        });
    }

    // Ensuring our state mirrors the passed down props
    componentDidUpdate(prevProps, prevState) {
        if (prevState.allCampuses !== this.props.campuses) {
            const { currentPage } = this.state;

            // Reupdate max page count
            const maxPageCount = Math.ceil(this.props.campuses.length / 10);

            // Update student
            this.setState({
                ...this.state,
                allCampuses: this.props.campuses,
                displayedCampuses: this.sliceDisplayedCampuses(currentPage),
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

    sliceDisplayedCampuses(currentPage) {
        // Displayed students slicing
        const start = currentPage * 10 - 10;
        const end = currentPage * 10;

        // Return a segment of the all students block
        return this.props.campuses.slice(start, end);
    }

    // Handles pagination clicks
    handlePageClick(data) {
        // Redirect to clicked page
        const page = parseInt(data.selected) + 1;

        const displayedCampuses = this.sliceDisplayedCampuses(page);

        // Set clicked page to state
        this.setState(
            {
                ...this.state,
                currentPage: page,
                displayedCampuses,
            },
            () => {
                // Redirect to clicked page
                this.props.history.push(`/campuses?page=${page}`);
            },
        );
    }

    render() {
        const {
            loading,
            currentPage,
            allCampuses,
            displayedCampuses,
            maxPageCount,
        } = this.state;

        return (
            <React.Fragment>
                <CampusListingHeader />
                <div className="main-listing-view">
                    <div className="main-view-chunk">
                        <Sidebar student={false} />
                        <div className="main-view-list-campus">
                            {/* Displays loading page if loading */}
                            {loading ? (
                                <Loading />
                            ) : (
                                <React.Fragment>
                                    <h2>All Campuses</h2>
                                    {displayedCampuses.length ? (
                                        // If there are campuses, render cards
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
                                                {displayedCampuses.map(
                                                    (campus) => (
                                                        <CampusCard
                                                            key={campus.id}
                                                            {...campus}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        // If there are no campuses, display this message
                                        <React.Fragment>
                                            <div className="main-view-listings-container">
                                                There are no campuses registered
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

function mapDispatchToProps(dispatch) {
    return {
        loadAllCampuses: () => dispatch(fetchAllCampuses()),
    };
}

export default withRouter(connect(null, mapDispatchToProps)(CampusListing));
