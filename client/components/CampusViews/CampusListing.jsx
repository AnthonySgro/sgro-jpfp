import React, { Component } from "react";

// Component Imports
import CampusCard from "../Cards/CampusCard.jsx";
import CampusAdd from "../Forms/CampusAdd.jsx";

// Redux imports
import { connect } from "react-redux";

class CampusListing extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}
    render() {
        const { campuses } = this.props;
        return (
            <React.Fragment>
                <div className="main-view-header">
                    <h1 className="main-view-title">All Campuses</h1>
                </div>
                <div className="main-view-chunk">
                    <nav className="main-view-sidebar">
                        <h2 className="main-view-sidebar-title">Menu</h2>
                        <CampusAdd />
                    </nav>
                    <div className="main-view-list-backdrop">
                        <div className="main-view-list-campus">
                            {campuses.length > 0 ? (
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
                                <div className="main-view-listings-container">
                                    There are no campuses registered in the
                                    database
                                </div>
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
        campuses: state.campusInfo.allCampuses,
    };
}

export default connect(mapStateToProps)(CampusListing);
