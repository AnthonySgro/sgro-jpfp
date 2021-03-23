import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import {
    fetchCampusDetail,
    deleteCampusFromDatabase,
} from "../../store/campus";

// Component Imports
import StudentCard from "../Cards/StudentCard.jsx";

class CampusDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submitDelete = this.submitDelete.bind(this);
    }

    componentDidMount() {
        // Get props to load campus
        const id = parseInt(this.props.match.params.id);
        const { loadCampus } = this.props;

        // On mount, load the specific campus here
        loadCampus(id);
    }

    submitDelete(id) {
        const { deleteCampus } = this.props;
        deleteCampus(id);
        this.props.history.push(`/campuses`);
    }

    render() {
        // Deconstructs all information from campus store obj
        const {
            name,
            description,
            id,
            imgUrl,
            street,
            city,
            state,
            zip,
            Students,
        } = this.props.campus;

        // Display loading screen until our axios call resolves
        if (!id) {
            return <p>Loading...</p>;
        }

        // Page content
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
                        <p className="info-detail-address-street">{street}</p>
                        <p className="info-detail-address-citystate">
                            {`${city}, ${state} ${zip}`}
                        </p>
                    </div>
                    <div className="info-detail-button-container">
                        <button className="edit-btn">Edit</button>
                        <button
                            className="delete-btn"
                            onClick={() => this.submitDelete(id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <div className="campus-listings-container">
                    {Students.map((student) => (
                        <StudentCard
                            key={student.id}
                            {...student}
                            Campus={this.props.campus}
                        />
                    ))}
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
        deleteCampus: (id) => dispatch(deleteCampusFromDatabase(id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CampusDetail);
