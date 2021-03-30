import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import {
    fetchStudentDetail,
    deleteStudentFromDatabase,
    updateStudentInDatabase,
} from "../../../store/student";

// NPM Module Imports
import * as EmailValidator from "email-validator";

class StudentProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: { ...props.student },
            preValues: { ...props.student },
            editing: false,
            styles: {
                editLabel: "Edit",
                saveChangesStyles: {
                    visibility: "hidden",
                    position: "absolute",
                    display: "none",
                },
                firstNameInput: {
                    backgroundColor: "",
                },
                lastNameInput: {
                    backgroundColor: "",
                },
                gpa: {
                    backgroundColor: "",
                },
                email: {
                    backgroundColor: "",
                },
            },
            feedback: {
                text: "hello",
                styles: {
                    visibility: "hidden",
                    color: "#e74c3c",
                    fontSize: "small",
                },
            },
        };

        this.toggleEditing = this.toggleEditing.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitDelete = this.submitDelete.bind(this);
        this.gpaValidator = this.gpaValidator.bind(this);
        this.isEmptyValidator = this.isEmptyValidator.bind(this);
    }

    // Dispatches update student event
    async handleSubmit(event) {
        // Prevents the form from submitting normally
        event.preventDefault();

        const { id, firstName, lastName, gpa, email } = this.state.student;
        const { feedback } = this.state;

        // Check if everything is entered correctly
        const namesValid = this.isEmptyValidator(firstName, lastName);
        const emailValid = EmailValidator.validate(email);
        const gpaValid = this.gpaValidator(gpa);

        // Cannot have repeated emails
        let emailRepeat = false;
        for (let student of this.props.allStudents) {
            if (email === student.email && id !== student.id) {
                emailRepeat = true;
            }
        }

        // Determine if everything is valid for submission
        const allValid = namesValid && emailValid && gpaValid && !emailRepeat;

        if (allValid) {
            const { student } = this.state;

            // First trim the input values
            this.setState(
                {
                    ...this.state,
                    student: {
                        ...student,
                        firstName: firstName.trim(),
                        lastName: lastName.trim(),
                        gpa: gpa.trim(),
                        email: email.trim(),
                    },
                },

                // Submits the updated student data to our redux thunk for post request
                async () => {
                    await this.props.updateStudent({ ...this.state.student });

                    // Revert editing windows
                    this.toggleEditing();

                    // If successful (not implemented yet), reset our state to be in sync with the database
                    this.setState({
                        ...this.state,
                        student: { ...student },
                        preValues: { ...student },
                    });
                },
            );
        } else if (emailRepeat) {
            // Feedback for email
            this.setState({
                ...this.state,
                feedback: {
                    ...feedback,
                    styles: { ...feedback.styles, visibility: "visible" },
                    text: "This email is already in use",
                },
            });
        }
    }

    // Dispatches Delete Student
    async submitDelete() {
        const { triggerLoading, deleteStudent, history } = this.props;

        // Trigger loading component if delete takes more than 50 milliseconds
        triggerLoading(50);

        // Deletes Student
        await deleteStudent({
            id: this.state.student.id,
            campus: this.state.preValues.Campus,
        });

        // Redirect
        history.push(`/students`);
    }

    // Modify the state with a controlled form
    handleChange(event) {
        const { student, styles, feedback } = this.state;

        // Set value to whatever was typed
        this.setState(
            {
                ...this.state,
                student: {
                    ...student,
                    [event.target.name]: event.target.value,
                },
            },
            // Afterwards, get user feedback styles after values are set
            () => {
                const { firstName, lastName, email, gpa } = this.state.student;

                // Style based on if the input is valid or not
                const firstValid = this.isEmptyValidator(firstName);
                const lastValid = this.isEmptyValidator(lastName);
                let emailValid = EmailValidator.validate(email);
                const gpaValid = this.gpaValidator(gpa);

                const firstBackground = firstValid ? "#ffffff" : "#ff9999";
                const lastBackground = lastValid ? "#ffffff" : "#ff9999";
                const emailBackground = emailValid ? "#ffffff" : "#ff9999";
                const gpaBackground = gpaValid ? "#ffffff" : "#ff9999";

                this.setState({
                    ...this.state,
                    styles: {
                        ...styles,
                        firstNameInput: {
                            backgroundColor: firstBackground,
                        },
                        lastNameInput: {
                            backgroundColor: lastBackground,
                        },
                        gpaInput: {
                            backgroundColor: gpaBackground,
                        },
                        emailInput: {
                            backgroundColor: emailBackground,
                        },
                    },
                    feedback: {
                        ...feedback,
                        styles: { ...feedback.styles, visibility: "hidden" },
                        text: "",
                    },
                });
            },
        );
    }

    // Returns true if all arguments are valid, false if any are invalid
    isEmptyValidator(...args) {
        for (let arg of args) {
            if (!arg.trim()) {
                return false;
            }
        }

        return true;
    }

    // Validates based on regex
    gpaValidator(input) {
        const pattern = new RegExp("^[0-9]+([.][0-9]+)?$");

        let valid = true;

        // Not between 0 and 4
        if (input * 1 < 0 || input * 1 > 4) {
            valid = false;
            // Doesn't match our decimal regex
        } else if (!pattern.test(input)) {
            valid = false;
        }

        return valid;
    }

    // Toggles editing view
    toggleEditing() {
        const { editing, feedback } = this.state;

        // Gets the styles
        const backgroundColor = editing ? "" : "#ffffff";
        const editLabel = editing ? "Edit" : "Disregard Changes";
        const saveChangesStyles = editing
            ? {
                  visibility: "hidden",
                  position: "absolute",
                  display: "none",
              }
            : {
                  visibility: "visible",
                  position: "static",
              };

        // If user pressed editing again, disregard changes
        const student = editing
            ? { ...this.state.preValues }
            : { ...this.state.student };

        this.setState({
            ...this.state,
            student,
            editing: !editing,
            styles: {
                ...this.state.styles,
                saveChangesStyles,
                editLabel,
                firstNameInput: { backgroundColor },
                lastNameInput: { backgroundColor },
                gpaInput: { backgroundColor },
                emailInput: { backgroundColor },
            },
            feedback: {
                ...feedback,
                styles: { ...feedback.styles, visibility: "hidden" },
                text: "",
            },
        });
    }

    render() {
        // Break out the state of our student
        const { firstName, lastName, email, gpa, imgUrl } = this.state.student;

        // Break out the state of other styling elements we want to track
        const {
            editLabel,
            saveChangesStyles,
            firstNameInput,
            lastNameInput,
            gpaInput,
            emailInput,
        } = this.state.styles;

        // Editing and feedback
        const { editing, feedback } = this.state;

        // Displays component
        return (
            <div className="info-detail-profile student-detail-profile-main">
                <div className="info-detail-img-container">
                    <img src={imgUrl} alt="" className="info-detail-img" />
                </div>
                <form onSubmit={this.handleSubmit} className="detail-form">
                    <div className="info-detail-text">
                        <div className="info-detail-name">
                            <input
                                id="first-name-editor"
                                type="text"
                                className="info-detail-title disabled"
                                name="firstName"
                                disabled={!editing}
                                style={{
                                    width: firstName
                                        ? firstName.length + "ch"
                                        : "0ch",
                                    ...firstNameInput,
                                }}
                                value={firstName}
                                onChange={this.handleChange}
                            />
                            <input
                                id="last-name-editor"
                                type="text"
                                className="info-detail-title disabled"
                                name="lastName"
                                disabled={!editing}
                                style={{
                                    width: lastName
                                        ? lastName.length + "ch"
                                        : "0ch",
                                    ...lastNameInput,
                                }}
                                value={lastName}
                                onChange={this.handleChange}
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
                                    disabled={!editing}
                                    style={{ width: "3ch", ...gpaInput }}
                                    value={gpa || ""}
                                    onChange={this.handleChange}
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
                                    disabled={!editing}
                                    style={{
                                        width: email
                                            ? email.length + "ch"
                                            : "0ch",
                                        ...emailInput,
                                    }}
                                    value={email}
                                    onChange={this.handleChange}
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
                                className="card-delete-button profile-button"
                                onClick={this.submitDelete}
                            >
                                Delete
                            </button>
                        </div>
                        <div
                            id="student-profile-feedback"
                            style={{ ...feedback.styles }}
                        >
                            {feedback.text}
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        allStudents: state.studentInfo.allStudents,
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
