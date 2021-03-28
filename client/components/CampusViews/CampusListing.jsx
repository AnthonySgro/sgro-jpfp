import React, { Component } from "react";

// Redux imports
import { connect } from "react-redux";
import { fetchAllCampuses } from "../../store/campus";

// Component Imports
import CampusCard from "../Cards/CampusCard.jsx";
import Sidebar from "../Sidebar.jsx";
import Loading from "../Loading.jsx";
import CampusListingHeader from "../ListingHeaders/CampusListingHeader.jsx";

class CampusListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            campuses: [],
            loading: true,
        };
    }

    // We want to get all the students when this page mounts
    async componentDidMount() {
        // This breaks the entire application and I don't know why...
        // await this.props.loadAllCampuses();
        this.setState({
            // campuses: this.props.allCampuses,
            loading: false,
        });
    }

    render() {
        const { loading } = this.state;
        const { campuses } = this.props;

        return (
            <React.Fragment>
                <CampusListingHeader />
                <div className="main-listing-view">
                    <div className="main-view-chunk">
                        <Sidebar
                            removeAdder={this.removeAdder}
                            student={false}
                        />
                        <div className="main-view-list-campus">
                            {/* Displays loading page if loading */}
                            {loading ? (
                                <Loading />
                            ) : (
                                <React.Fragment>
                                    <h2>All Campuses</h2>
                                    {campuses.length ? (
                                        // If there are campuses, render cards
                                        <div className="main-view-listings-container">
                                            {campuses.map((campus) => (
                                                <CampusCard
                                                    key={campus.id}
                                                    {...campus}
                                                />
                                            ))}
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadAllCampuses: () => dispatch(fetchAllCampuses()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CampusListing);
