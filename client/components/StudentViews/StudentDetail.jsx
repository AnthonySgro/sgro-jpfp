import React, { Component } from "react";

// React Router Imports

// Redux Imports
import { connect } from "react-redux";
import {
    fetchStudentDetail,
    deleteStudentFromDatabase,
    updateStudentInDatabase,
} from "../../store/student";
import { fetchAllCampuses } from "../../store/campus";

// Component Imports
import CampusCard from "../Cards/CampusCard.jsx";

class StudentDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            gpa: "",
            id: "",
            editLabel: "Edit",
            saveChangesStyles: {
                visibility: "hidden",
                position: "absolute",
            },
            preValues: {
                firstName: "",
                lastName: "",
                gpa: "",
                id: "",
            },
        };
        this.getStudentCampusDetails = this.getStudentCampusDetails.bind(this);
        this.getAllOtherCampuses = this.getAllOtherCampuses.bind(this);
        this.submitDelete = this.submitDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.enableEditing = this.enableEditing.bind(this);
    }

    async componentDidMount() {
        // Get props to load campus
        const id = parseInt(this.props.match.params.id);
        const { loadStudent, loadAllCampuses } = this.props;

        // On mount, load student and all campuses
        await loadStudent(id);
        await loadAllCampuses();

        const { firstName, lastName, imgUrl, gpa } = this.props.student;

        this.setState({
            firstName,
            lastName,
            gpa,
            id,
            preValues: {
                firstName,
                lastName,
                gpa,
            },
        });
    }

    enableEditing() {
        const inputs = document.getElementsByTagName("INPUT");
        for (let input of inputs) {
            input.disabled = !input.disabled;
            input.classList.toggle("disabled");
            input.classList.toggle("enabled");
        }

        // If we are disregarding changes, rever to the original values
        if (inputs[0].disabled === true) {
            const { preValues } = this.state;
            this.setState({
                firstName: preValues.firstName,
                lastName: preValues.lastName,
                gpa: preValues.gpa,
                editLabel: "Edit",
            });
            // If we are starting edit, display option to disregard changes
        } else {
            this.setState({
                editLabel: "Disregard Changes",
            });
        }

        // Toggles the visibility of our "save changes" button
        const { saveChangesStyles } = this.state;
        if (saveChangesStyles.visibility === "hidden") {
            this.setState({
                saveChangesStyles: {
                    visibility: "visible",
                    position: "static",
                },
            });
        } else {
            this.setState({
                saveChangesStyles: {
                    visibility: "hidden",
                    position: "absolute",
                    display: "none",
                },
            });
        }
    }

    // Modifies the state to reflect current text in input fields
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    async handleSubmit(event) {
        // Prevents the form from submitting normally
        event.preventDefault();

        // Prepare payload
        const { firstName, lastName, id, gpa } = this.state;

        const payload = {
            firstName,
            lastName,
            gpa,
            id,
        };

        // Submits the data to our redux thunk which makes the post request
        await this.props.updateStudent(payload);

        // If successful (not implemented yet), reset our state to be in sync with the database
        this.setState({
            firstName,
            lastName,
            gpa,
            preValues: { ...payload, gpa: gpa || "N/A" },
        });

        // Reverts our styling to pre-editing
        this.enableEditing();
    }

    getStudentCampusDetails() {
        const { allCampuses } = this.props;
        const { CampusId } = this.props.student;

        // Returns campus object for student
        return allCampuses.find((campus) => campus.id === CampusId);
    }

    getAllOtherCampuses() {
        const { allCampuses } = this.props;
        const { CampusId } = this.props.student;

        // If no student id, return all campuses
        if (!CampusId) {
            return allCampuses;
        }

        // Returns list of campuses student is not at
        return allCampuses.filter((campus) => campus.id !== CampusId);
    }

    submitDelete(id) {
        const { deleteStudent } = this.props;
        deleteStudent(id);
        this.props.history.push(`/students`);
    }

    render() {
        // Deconstructs all information from campus store obj
        const { firstName, lastName, id, imgUrl } = this.props.student;

        // Get campus information
        const campus = this.getStudentCampusDetails();
        const allOtherCampuses = this.getAllOtherCampuses();

        // Display loading screen until our axios call resolves
        if (!id) {
            return <p>Loading...</p>;
        }

        // Page content
        return (
            <React.Fragment>
                <div className="info-detail-main">
                    <div className="info-detail-profile">
                        <div className="info-detail-img-container">
                            <img
                                src={imgUrl}
                                alt=""
                                className="info-detail-img"
                            />
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
                                            width:
                                                this.state.firstName.length +
                                                "ch",
                                        }}
                                        value={this.state.firstName}
                                        onChange={() =>
                                            this.handleChange(event)
                                        }
                                    />
                                    <input
                                        id="last-name-editor"
                                        type="text"
                                        className="info-detail-title disabled"
                                        name="lastName"
                                        disabled
                                        style={{
                                            width:
                                                this.state.lastName.length +
                                                "ch",
                                        }}
                                        value={this.state.lastName}
                                        onChange={() =>
                                            this.handleChange(event)
                                        }
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
                                                width:
                                                    this.state.gpa !== null
                                                        ? this.state.gpa
                                                              .length + "ch"
                                                        : "3ch",
                                            }}
                                            value={this.state.gpa || ""}
                                            onChange={() =>
                                                this.handleChange(event)
                                            }
                                            maxLength="3"
                                        />
                                    </div>
                                </div>
                                <div className="info-detail-button-container">
                                    <a
                                        className="card-edit-link"
                                        onClick={this.enableEditing}
                                    >
                                        {this.state.editLabel || ""}
                                    </a>
                                    <button
                                        type="submit"
                                        className="add-btn add-after-listings"
                                        id="save-changes"
                                        style={
                                            this.state.saveChangesStyles || ""
                                        }
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        className="card-delete-button"
                                        onClick={() => this.submitDelete(id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {campus ? (
                        // If student has a campus
                        <div className="student-detail-campus">
                            <div className="student-detail-campus-feedback">
                                This Student is registered to a campus
                            </div>
                            <div className="student-detail-campus-info">
                                <div className="student-detail-campus-card">
                                    <CampusCard {...campus} />
                                </div>
                                <div className="student-detail-campus-edit">
                                    <select name="student-detail-campus-select">
                                        <option value={0}>
                                            Select Campus...
                                        </option>
                                        {allOtherCampuses.map((campus) => (
                                            <option
                                                key={campus.id}
                                                value={campus.name}
                                            >
                                                {campus.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button>Change Campus</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // If student does not have a campus
                        <div className="student-detail-campus">
                            <div className="student-detail-campus-feedback">
                                This Student is not registered to a campus
                            </div>
                            <div className="student-detail-campus-info">
                                <div className="student-detail-campus-edit">
                                    <select name="student-detail-campus-select">
                                        <option value={0}>
                                            Select Campus...
                                        </option>
                                        {allOtherCampuses.map((campus) => (
                                            <option
                                                key={campus.id}
                                                value={campus.name}
                                            >
                                                {campus.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button>Change Campus</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        student: state.studentInfo.selectedStudent,
        allCampuses: state.campusInfo.allCampuses,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadStudent: (id) => dispatch(fetchStudentDetail(id)),
        loadAllCampuses: () => dispatch(fetchAllCampuses()),
        deleteStudent: (sId) => dispatch(deleteStudentFromDatabase(sId)),
        updateStudent: (student) => dispatch(updateStudentInDatabase(student)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentDetail);
