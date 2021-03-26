import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import {
    fetchStudentDetail,
    deleteStudentFromDatabase,
    updateStudentInDatabase,
} from "../../../store/student";

class StudentProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: { ...props.student },
            preValues: { ...props.student },
            styles: {
                editLabel: "Edit",
                saveChangesStyles: {
                    visibility: "hidden",
                    position: "absolute",
                    display: "none",
                },
            },
        };

        this.toggleEditing = this.toggleEditing.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitDelete = this.submitDelete.bind(this);
    }

    // Dispatches update student event
    async handleSubmit(event) {
        // Prevents the form from submitting normally
        event.preventDefault();

        // Submits the updated student data to our redux thunk for post request
        const { student } = this.state;
        await this.props.updateStudent({ ...this.state.student });

        // Revert editing windows
        this.toggleEditing();

        // If successful (not implemented yet), reset our state to be in sync with the database
        this.setState({
            student: { ...student },
            preValues: { ...student },
        });
    }

    // Dispatches Delete Student
    submitDelete() {
        const { deleteStudent } = this.props;
        deleteStudent({
            id: this.state.student.id,
            campus: this.state.preValues.Campus,
        });

        this.props.history.push(`/students`);
    }

    // Modify the state with a controlled form
    handleChange(event) {
        const { student } = this.state;
        this.setState({
            student: {
                ...student,
                [event.target.name]: event.target.value,
            },
        });
    }

    // Toggles editing view
    toggleEditing() {
        const { student, preValues } = this.state;
        const { saveChangesStyles, editLabel } = this.state.styles;

        // Toggles input editability
        const inputs = document.getElementsByTagName("INPUT");
        for (let input of inputs) {
            input.disabled = !input.disabled;
            input.classList.toggle("disabled");
            input.classList.toggle("enabled");
        }

        // If we are disregarding changes, revert to the original values
        if (inputs[0].disabled === true) {
            this.setState({
                student: {
                    ...student,
                    firstName: preValues.firstName,
                    lastName: preValues.lastName,
                    gpa: preValues.gpa,
                },
            });
        }

        // Toggles the visibility of our "save changes" button and edit label
        const newEditLabel =
            editLabel !== "Edit" ? "Edit" : "Disregard Changes";
        const newSaveChanges =
            saveChangesStyles.visibility === "hidden"
                ? {
                      visibility: "visible",
                      position: "static",
                      display: "inline",
                  }
                : {
                      visibility: "hidden",
                      position: "absolute",
                      display: "none",
                  };
        this.setState({
            styles: {
                editLabel: newEditLabel,
                saveChangesStyles: newSaveChanges,
            },
        });
    }

    render() {
        // Break out the state of our student
        const { firstName, lastName, gpa, email, imgUrl } = this.state.student;

        // Break out the state of other styling elements we want to track
        const { editLabel, saveChangesStyles } = this.state.styles;

        // Displays component
        return (
            <div className="info-detail-profile">
                <div className="info-detail-img-container">
                    <img src={imgUrl} alt="" className="info-detail-img" />
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div className="info-detail-text">
                        <div className="info-detail-name">
                            <input
                                id="first-name-editor"
                                type="text"
                                className="info-detail-title disabled"
                                name="firstName"
                                disabled
                                style={{
                                    width: firstName.length + "ch",
                                }}
                                value={firstName}
                                onChange={() => this.handleChange(event)}
                            />
                            <input
                                id="last-name-editor"
                                type="text"
                                className="info-detail-title disabled"
                                name="lastName"
                                disabled
                                style={{
                                    width: lastName.length + "ch",
                                }}
                                value={lastName}
                                onChange={() => this.handleChange(event)}
                            />
                        </div>
                        <div className="info-detail-information-container">
                            <h2 className="info-detail-subtitle">
                                Information
                            </h2>
                            <div className="info-detail-gpa-container">
                                <p>Gpa: </p>{" "}
                                <input
                                    id="gpa-editor"
                                    type="text"
                                    className="info-detail-information disabled"
                                    name="gpa"
                                    disabled
                                    style={{
                                        width: gpa.length + "ch",
                                    }}
                                    value={gpa}
                                    onChange={() => this.handleChange(event)}
                                    maxLength="3"
                                />
                            </div>
                            <div className="info-detail-email-container">
                                <p>Email: </p>{" "}
                                <input
                                    id="email-editor"
                                    type="text"
                                    className="info-detail-information disabled"
                                    name="email"
                                    disabled
                                    style={{
                                        width: email.length + "ch",
                                    }}
                                    value={email}
                                    onChange={() => this.handleChange(event)}
                                />
                            </div>
                        </div>
                        <div className="info-detail-button-container">
                            <a
                                className="card-edit-link"
                                onClick={this.toggleEditing}
                            >
                                {editLabel || ""}
                            </a>
                            <button
                                type="submit"
                                className="add-btn add-after-listings"
                                id="save-changes"
                                style={saveChangesStyles || ""}
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className="card-delete-button"
                                onClick={this.submitDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        selectedStudent: state.studentInfo.selectedStudent,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadStudent: (id) => dispatch(fetchStudentDetail(id)),
        deleteStudent: (sId) => dispatch(deleteStudentFromDatabase(sId)),
        updateStudent: (student) => dispatch(updateStudentInDatabase(student)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile);
