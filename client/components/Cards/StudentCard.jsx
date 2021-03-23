import React, { Component } from "react";

// React Router Links
import { Link } from "react-router-dom";

// Redux Imports
import { connect } from "react-redux";
import { deleteStudentFromDatabase } from "../../store/student";

class StudentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { id, Campus, firstName, lastName, imgUrl } = this.props;
        const { deleteStudent, stateCampus } = this.props;

        return (
            <div className="student-card-container card-container">
                <img
                    src={imgUrl}
                    alt="Student Image"
                    className="student-card-image"
                />
                <Link
                    to={`/students/${id}`}
                    className="student-card-name card-detail-link"
                >{`${firstName} ${lastName}`}</Link>
                <div className="student-card-university">
                    {/* If campus is passed down, display that too */}
                    {Campus ? (
                        <Link
                            to={`/campuses/${Campus.id}`}
                            className="student-card-campus card-detail-link"
                        >
                            {Campus.name}
                        </Link>
                    ) : (
                        <a className="student-card-campus student-card-info">
                            No University
                        </a>
                    )}
                </div>
                <div className="student-card-interact">
                    <button
                        className="card-delete-button"
                        onClick={() => deleteStudent(id, stateCampus.id)}
                    >
                        Delete
                    </button>
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
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentCard);
