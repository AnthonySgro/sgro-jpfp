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
            allCampuses: props.allCampuses,
            displayedCampuses: props.displayedCampuses,
            splicedCampuses: [],
            currentPage: 1,
            loading: true,
            maxPageCount: 1,
        };
        this.handlePageClick = this.handlePageClick.bind(this);
        this.sliceDisplayedCampuses = this.sliceDisplayedCampuses.bind(this);
        this.parseQuery = this.parseQuery.bind(this);
    }

    // We want to get all the students when we go to this page
    async componentDidMount() {
        // Load students
        await this.props.loadAllCampuses();

        const { allCampuses, displayedCampuses } = this.props;

        // Receive current page if a query was attatched to url
        const currentPage = this.parseQuery();

        // Get displayed students
        const splicedCampuses = this.sliceDisplayedCampuses(
            currentPage,
            displayedCampuses,
        );

        const maxPageCount = Math.ceil(displayedCampuses.length / 10);

        // Set all students
        this.setState({
            ...this.state,
            allCampuses,
            displayedCampuses,
            splicedCampuses,
            currentPage,
            loading: false,
            maxPageCount,
        });
    }

    // Making sure our local state matches the redux store
    componentDidUpdate(prevProps, prevState) {
        const { allCampuses, displayedCampuses } = this.props;

        // If our redux store changed something in the display
        if (prevState.displayedCampuses !== displayedCampuses) {
            // Splice students again accordingly
            const splicedCampuses = this.sliceDisplayedCampuses(
                prevState.currentPage,
                displayedCampuses,
            );

            // Save the state
            this.setState(
                {
                    ...this.state,
                    allCampuses,
                    displayedCampuses,
                    splicedCampuses,
                    maxPageCount: Math.ceil(displayedCampuses.length / 10),
                    loading: false,
                },
                () => {
                    // **
                    // ** This is here for emergency debugging reasons
                    // **
                    // State is updating asynchronously, and is called after the render
                    // We have to force an update to re-render the page once the
                    // Update is processed. Idk if this is bad but I think it is working
                    // this.forceUpdate();
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

    sliceDisplayedCampuses(currentPage, campuses) {
        // Displayed students slicing
        const start = currentPage * 10 - 10;
        const end = currentPage * 10;

        // Return a segment of the all students block
        return campuses.slice(start, end);
    }

    // Handles pagination clicks
    handlePageClick(data) {
        // Redirect to clicked page
        const page = parseInt(data.selected) + 1;

        const displayedCampuses = this.sliceDisplayedCampuses(
            page,
            this.state.displayedCampuses,
        );

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
            splicedCampuses,
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
                                    {allCampuses ? (
                                        // If there are campuses, render cards
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
                                                {splicedCampuses.map(
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

function mapStateToProps(state) {
    return {
        allCampuses: state.campusInfo.allCampuses,
        displayedCampuses: state.campusInfo.displayedCampuses,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadAllCampuses: () => dispatch(fetchAllCampuses()),
    };
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CampusListing),
);
