import React, { Component } from "react";

// React Router Links
import { Link } from "react-router-dom";

// Redux Imports
import { connect } from "react-redux";
import {
    deleteStudentFromDatabase,
    updateStudentInDatabase,
} from "../../store/student";
import { fetchCampusDetail } from "../../store/campus";

class StudentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.raiseImage = this.raiseImage.bind(this);
        this.lowerImage = this.lowerImage.bind(this);
        this.unregisterStudent = this.unregisterStudent.bind(this);
    }

    componentDidMount() {}

    raiseImage() {
        const { id } = this.props;
        const img = document.querySelector(`#student-card-img-${id}`);
        img.classList.add("card-img-hover");
    }

    lowerImage() {
        const { id } = this.props;
        const img = document.querySelector(`#student-card-img-${id}`);
        img.classList.remove("card-img-hover");
    }

    async unregisterStudent() {
        const { id, unregisterFunction, stateCampus, loadCampus } = this.props;

        // Calls the update thunk with an empty id
        await unregisterFunction({ id, campusId: "" });

        // Updates the selected campus so we see the update
        await loadCampus(stateCampus.id);
    }

    render() {
        const {
            id,
            Campus,
            firstName,
            lastName,
            imgUrl,
            unregister,
        } = this.props;

        const { deleteStudent, stateCampus } = this.props;

        return (
            <div
                className="student-card-container card-container"
                onMouseEnter={() => this.raiseImage()}
                onMouseLeave={() => this.lowerImage()}
            >
                <div className="student-card-image card-item-container">
                    <Link to={`/students/${id}`} className="image-link-wrapper">
                        <img
                            src={imgUrl}
                            alt="Student Image"
                            className="student-card-image"
                            id={`student-card-img-${id}`}
                        />
                    </Link>
                </div>

                <div className="student-card-name card-item-container">
                    <Link
                        to={`/students/${id}`}
                        className="student-card-name card-detail-link"
                    >{`${firstName} ${lastName}`}</Link>
                </div>
                <div className="student-card-university card-item-container card-university-container">
                    {/* If campus is passed down, display that too */}
                    {Campus ? (
                        <Link
                            to={`/campuses/${Campus.id}`}
                            className="student-card-campus card-detail-link"
                        >
                            {Campus.name}
                        </Link>
                    ) : (
                        <a className="student-card-campus card-detail-link">
                            No University
                        </a>
                    )}
                </div>
                <div className="student-card-interact card-item-container">
                    {unregister ? (
                        <button
                            className="card-delete-button"
                            onClick={() => this.unregisterStudent()}
                        >
                            <p className="delete-text">Unregister</p>
                        </button>
                    ) : (
                        <button
                            className="card-delete-button"
                            onClick={() => deleteStudent(id, stateCampus.id)}
                        >
                            <p className="delete-text">x</p>
                        </button>
                    )}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        stateCampus: state.campusInfo.selectedCampus,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        deleteStudent: (sId, cId) =>
            dispatch(deleteStudentFromDatabase(sId, cId)),
        unregisterFunction: (payload) =>
            dispatch(updateStudentInDatabase(payload)),
        loadCampus: (id) => dispatch(fetchCampusDetail(id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentCard);
