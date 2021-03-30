import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import { deleteStudentFromDatabase } from "../../store/student";
import { fetchCampusDetail } from "../../store/campus";

// React Router Links
import { Link } from "react-router-dom";

class StudentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: {
                id: props.id,
                Campus: props.Campus,
                firstName: props.firstName,
                lastName: props.lastName,
                imgUrl: props.imgUrl,
            },
            styles: {
                imgClassName: "student-card-img",
            },
        };
        this.raiseImage = this.raiseImage.bind(this);
        this.lowerImage = this.lowerImage.bind(this);
    }

    raiseImage() {
        this.setState({
            ...this.state,
            styles: { imgClassName: "student-card-img card-img-hover" },
        });
    }

    lowerImage() {
        this.setState({
            ...this.state,
            styles: { imgClassName: "student-card-img" },
        });
    }

    render() {
        // Destructuring data for render
        const { id, imgUrl, firstName, lastName, Campus } = this.state.student;
        const { imgClassName } = this.state.styles;
        const { deleteStudent, unregisterStudent } = this.props;
        const cId = Campus ? Campus.id : null;
        return (
            <div className="student-card-container card-container">
                <div className="student-card-image card-item-container">
                    <Link to={`/students/${id}`} className="image-link-wrapper">
                        <img
                            src={imgUrl}
                            alt="studentImage"
                            className={imgClassName}
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
                        onMouseEnter={this.raiseImage}
                        onMouseLeave={this.lowerImage}
                    >{`${firstName} ${lastName}`}</Link>
                </div>
                <div className="student-card-university card-item-container card-university-container">
                    {/* Displays Campus Name or "No University" */}
                    {Campus ? (
                        <Link
                            to={`/campuses/${Campus.id}`}
                            className="student-card-campus card-detail-link"
                        >
                            {Campus.name}
                        </Link>
                    ) : (
                        <a className="student-card-campus card-detail-link no-underline">
                            No University
                        </a>
                    )}
                </div>
                <div className="student-card-interact card-item-container">
                    {/* If parent passes an unregister function, display properly */}
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
