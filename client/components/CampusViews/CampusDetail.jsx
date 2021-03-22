import React, { Component } from "react";
import parseAddress from "parse-address-string";

// Redux Imports
import { connect } from "react-redux";

// Component Imports
import StudentListing from "../StudentViews/StudentListing.jsx";

class CampusDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // Get props to load campus
        const id = parseInt(this.props.match.params.id);
        const { loadCampus } = this.props;

        // On mount, load the specific campus here
        loadCampus(id);
    }

    render() {
        const {
            name,
            description,
            id,
            imgUrl,
            address,
            Students,
        } = this.props.campus;

        // Display loading screen until our axios call resolves
        if (!id) {
            return <p>Loading...</p>;
        }

        return (
            <React.Fragment>
                <div className="info-detail-main">
                    <img src={imgUrl} alt="" className="info-detail-img" />
                    <div className="info-detail-text">
                        <h1 className="info-detail-title">{name}</h1>
                        <p className="info-detail-information">{description}</p>
                    </div>
                </div>
                <div className="info-detail-additional">
                    <div className="info-detail-address-container">
                        <p className="info-detail-address-street">
                            323 W Address St
                        </p>
                        <p className="info-detail-address-citystate">
                            Citystate, Provence 78777
                        </p>
                    </div>
                    <div className="info-detail-button-container">
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                    </div>
                </div>
                <div className="campus-detail-students">
                    <StudentListing students={Students} />
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        campus: state.campusInfo.selectedCampus,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadCampus: (id) => dispatch(fetchCampusDetail(id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CampusDetail);
