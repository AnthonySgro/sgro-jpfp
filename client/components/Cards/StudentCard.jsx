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
            },
            styles: {
                imgClassName: "student-card-img",
            },
        };
        this.raiseImage = this.raiseImage.bind(this);
        this.lowerImage = this.lowerImage.bind(this);
        this.findStudentWithId = this.findStudentWithId.bind(this);
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

    // most updated student info will be pulled from redux store
    findStudentWithId(id) {
        if (!id) {
            return undefined;
        }

        const { allStudents } = this.props;
        const thisStudent = allStudents.filter((student) => student.id === id);
        return thisStudent[0];
    }

    render() {
        const student = this.findStudentWithId(this.state.student.id);

        // If nothing passed, don't render
        if (!student) {
            return null;
        }

        // Destructuring data for render
        const { id, firstName, lastName, Campus, imgUrl } = student;

        const { imgClassName } = this.state.styles;
        const { deleteStudent, unregisterStudent } = this.props;

        const cId = Campus ? Campus.id : null;

        // The reason for this is to check if campus was found from our student object.
        // We can fix this later by making sure a newly added student has an associated campus returned
        // From the database, but for now, this works.
        const propCampus = Campus ? Campus : this.props.campus;

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
                    {propCampus ? (
                        <Link
                            to={`/campuses/${propCampus.id}`}
                            className="student-card-campus card-detail-link"
                        >
                            {propCampus.name}
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
                                deleteStudent({ id, campus: propCampus }, cId)
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
        allStudents: state.studentInfo.allStudents,
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
