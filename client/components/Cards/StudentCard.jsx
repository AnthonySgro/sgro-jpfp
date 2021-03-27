import React, { Component } from "react";

// React Router Links
import { Link } from "react-router-dom";

// Redux Imports
import { connect } from "react-redux";
import { deleteStudentFromDatabase } from "../../store/student";
import { fetchCampusDetail } from "../../store/campus";

class StudentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            Campus: props.Campus,
            firstName: props.firstName,
            lastName: props.lastName,
            imgUrl: props.imgUrl,
        };
        this.raiseImage = this.raiseImage.bind(this);
        this.lowerImage = this.lowerImage.bind(this);
    }

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

    render() {
        // Destructuring data for render
        const { id, imgUrl, firstName, lastName, Campus } = this.state;
        const { deleteStudent, stateCampus, unregisterStudent } = this.props;
        const cId = Campus ? Campus.id : null;

        return (
            <div className="student-card-container card-container">
                <div className="student-card-image card-item-container">
                    <Link to={`/students/${id}`} className="image-link-wrapper">
                        <img
                            src={imgUrl}
                            alt="Student Image"
                            className="student-card-image"
                            id={`student-card-img-${id}`}
                            onMouseEnter={this.raiseImage}
                            onMouseLeave={this.lowerImage}
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
                            onMouseEnter={this.raiseImage}
                            onMouseLeave={this.lowerImage}
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
                    {unregisterStudent ? (
                        <button
                            className="card-delete-button"
                            onClick={() => unregisterStudent(id)}
                        >
                            <p className="delete-text">Unregister</p>
                        </button>
                    ) : (
                        <button
                            className="card-delete-button"
                            onClick={() =>
                                deleteStudent({ id, campus: Campus }, cId)
                            }
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
        selectedCampus: state.campusInfo.selectedCampus,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        deleteStudent: (studentInfo, cId) =>
            dispatch(deleteStudentFromDatabase(studentInfo, cId)),
        loadCampus: (id) => dispatch(fetchCampusDetail(id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentCard);
