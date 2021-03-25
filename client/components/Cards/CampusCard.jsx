import React, { Component } from "react";

// React Router Links
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { deleteCampusFromDatabase } from "../../store/campus";
import {
    updateStudentInDatabase,
    fetchStudentDetail,
} from "../../store/student";

class CampusCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.raiseImage = this.raiseImage.bind(this);
        this.lowerImage = this.lowerImage.bind(this);
        this.unregisterStudent = this.unregisterStudent.bind(this);
    }

    raiseImage() {
        const { id } = this.props;
        const img = document.querySelector(`#campus-card-img-${id}`);
        img.classList.add("card-img-hover");
    }

    lowerImage() {
        const { id } = this.props;
        const img = document.querySelector(`#campus-card-img-${id}`);
        img.classList.remove("card-img-hover");
    }

    async unregisterStudent() {
        const { studentId, unregisterFunction, loadStudent } = this.props;
        if (studentId) {
            // Calls the update thunk with an empty id
            await unregisterFunction({ id: studentId, campusId: "" });

            this.props.resetSelect();

            // Loads the selected student again
            await loadStudent(studentId);
        }
    }

    render() {
        const {
            id,
            name,
            imgUrl,
            description,
            studentCount,
            unregister,
        } = this.props;
        const { deleteCampus } = this.props;

        // Pluralize student count corrently
        const plural = studentCount !== "1";

        return (
            <div
                className="campus-card-container card-container"
                onMouseEnter={() => this.raiseImage()}
                onMouseLeave={() => this.lowerImage()}
            >
                <div className="campus-card-image-container">
                    <Link to={`/campuses/${id}`} className="">
                        <img
                            src={imgUrl}
                            alt="Campus Image"
                            id={`campus-card-img-${id}`}
                        />
                    </Link>
                </div>
                <div className="campus-card-info-container">
                    <div className="">
                        <Link to={`/campuses/${id}`} className="">
                            {name}
                        </Link>
                        <p className="campus-card-numStudents">
                            {`${studentCount} ${
                                plural ? "Students" : "Student"
                            } `}
                        </p>
                    </div>
                    <div className="campus-card-info-interact ">
                        <Link to={`/campuses/${id}`} className="card-edit-link">
                            Edit
                        </Link>
                        {unregister ? (
                            <button
                                type="button"
                                className="card-delete-button"
                                onClick={() => this.unregisterStudent()}
                            >
                                <p className="delete-text">Unregister</p>
                            </button>
                        ) : (
                            <button
                                className="card-delete-button"
                                onClick={() =>
                                    deleteStudent(id, stateCampus.id)
                                }
                            >
                                <p className="delete-text">x</p>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteCampus: (id) => dispatch(deleteCampusFromDatabase(id)),
        unregisterFunction: (payload) =>
            dispatch(updateStudentInDatabase(payload)),
        loadStudent: (id) => dispatch(fetchStudentDetail(id)),
    };
}

export default connect(null, mapDispatchToProps)(CampusCard);
