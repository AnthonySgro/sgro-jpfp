import React, { Component } from "react";

// Component Imports
import CampusCard from "../Cards/CampusCard.jsx";

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
                    <button className="main-view-btn">Add Campus</button>
                </div>
                <br />
                {/* If there are campuses, render a card for each */}
                {campuses.length > 0 ? (
                    <div className="campus-listings-container">
                        {campuses.map((campus) => (
                            <CampusCard key={campus.id} {...campus} />
                        ))}
                    </div>
                ) : (
                    // If there are no campuses, display this message
                    <p>There are no campuses registered in the database</p>
                )}
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
