import React, { Component } from "react";

// React Router Links
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { deleteCampusFromDatabase } from "../../store/campus";
import {
    changeStudentCampusInDatabase,
    fetchStudentDetail,
} from "../../store/student";

class CampusCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            name: props.name,
            imgUrl: props.imgUrl,
            description: props.description,
            studentCount: props.studentCount,
        };
        this.raiseImage = this.raiseImage.bind(this);
        this.lowerImage = this.lowerImage.bind(this);
        this.unregisterStudent = this.unregisterStudent.bind(this);
    }

    // Fun hover effect
    raiseImage() {
        const { id } = this.state;
        const img = document.querySelector(`#campus-card-img-${id}`);
        img.classList.add("card-img-hover");
    }

    // Fun hover effect
    lowerImage() {
        const { id } = this.state;
        const img = document.querySelector(`#campus-card-img-${id}`);
        img.classList.remove("card-img-hover");
    }

    async unregisterStudent() {
        const { studentId, changeRegistration, id } = this.props;
        if (studentId) {
            // Calls the update thunk with an empty id
            await changeRegistration({
                id: studentId,
                newCampusId: 0,
                prevCampusId: id,
            });

            this.props.resetSelect();
        }
    }

    render() {
        const { id, name, imgUrl, description, studentCount } = this.state;
        const { unregister, deleteCampus } = this.props;

        // Pluralize student count corrently
        const plural = parseInt(studentCount) !== 1;

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
                                onClick={() => deleteCampus(id)}
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

function mapStateToProps(state) {
    return {
        allCampuses: state.campusInfo.allCampuses,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        deleteCampus: (id) => dispatch(deleteCampusFromDatabase(id)),
        changeRegistration: (payload) =>
            dispatch(changeStudentCampusInDatabase(payload)),
        loadStudent: (id) => dispatch(fetchStudentDetail(id)),
    };
}

export default connect(null, mapDispatchToProps)(CampusCard);
