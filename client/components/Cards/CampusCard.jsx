import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import { deleteCampusFromDatabase } from "../../store/campus";
import {
    changeStudentCampusInDatabase,
    fetchStudentDetail,
} from "../../store/student";

// React Router Imports
import { Link } from "react-router-dom";

class CampusCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            campus: {
                id: props.id,
                name: props.name,
                imgUrl: props.imgUrl,
                description: props.description,
                studentCount: props.studentCount,
            },
            styles: { imgClassName: "campus-card-img" },
        };
        this.raiseImage = this.raiseImage.bind(this);
        this.lowerImage = this.lowerImage.bind(this);
        this.unregisterStudent = this.unregisterStudent.bind(this);
    }

    // Fun hover effect
    raiseImage() {
        this.setState({
            ...this.state,
            styles: { imgClassName: "student-card-img card-img-hover" },
        });
    }

    // Fun hover effect
    lowerImage() {
        this.setState({
            ...this.state,
            styles: { imgClassName: "campus-card-img" },
        });
    }

    // Unregisters student (passed down from parent)
    async unregisterStudent() {
        try {
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
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        const { id, name, imgUrl, studentCount } = this.state.campus;
        const { imgClassName } = this.state.styles;
        const { unregister, deleteCampus } = this.props;

        // Pluralize student count corrently
        const plural = parseInt(studentCount) !== 1;

        return (
            <div className="campus-card-container card-container">
                <div className="campus-card-image-container">
                    <Link to={`/campuses/${id}`} className="">
                        <img
                            src={imgUrl}
                            alt="Campus Image"
                            className={imgClassName}
                            id={`campus-card-img-${id}`}
                            onMouseEnter={this.raiseImage}
                            onMouseLeave={this.lowerImage}
                        />
                    </Link>
                </div>
                <div className="campus-card-info-container">
                    <div className="">
                        <Link
                            to={`/campuses/${id}`}
                            className=""
                            onMouseEnter={this.raiseImage}
                            onMouseLeave={this.lowerImage}
                        >
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
