import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import { changeStudentCampusInDatabase } from "../../../store/student";

// Component Imports
import CampusCard from "../../Cards/CampusCard.jsx";

class StudentCampusModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            campus: props.campus,
            campusId: props.campusId,
            preValues: { campus: props.campus, campusId: props.campusId },
        };
        this.resetSelect = this.resetSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitRegistrationChange = this.submitRegistrationChange.bind(
            this,
        );
    }

    // Handles updated campus registration
    async submitRegistrationChange(event) {
        event.preventDefault();

        const { changeRegistration } = this.props;
        const { id } = this.state;
        const newCampusId = parseInt(this.state.campusId);
        const prevCampusId = this.state.preValues.campusId;

        // If submitted on the default "...select campus" option, return
        if (newCampusId === 0) {
            return;
        }

        // Dispatches the 'change registration' event
        await changeRegistration({ id, newCampusId, prevCampusId });

        // Searches the state for our new campus bc we updated "student count"
        const { allCampuses } = this.props;
        const newCampus = allCampuses.find(
            (campus) => campus.id === newCampusId,
        );

        // New Student from Redux Store
        const { newStudent } = this.props;

        // If successful (not implemented yet) update the state to these values
        this.setState({
            ...this.state,
            campus: newCampus,
            campusId: newStudent.CampusId,
            preValues: {
                campus: newCampus,
                campusId: newStudent.CampusId,
            },
        });
    }

    // Modify the state with a controlled form
    handleChange(event) {
        const { allCampuses } = this.props;

        // Finds the full campus
        const selectedCampus = allCampuses.find(
            (campus) => campus.id === parseInt(event.target.value),
        );

        // Local state controls form
        this.setState({
            campus: selectedCampus,
            campusId: parseInt(event.target.value),
        });
    }

    // Converts everything to datatypes our select element likes
    resetSelect() {
        this.setState({
            campusId: null,
            campus: null,
            preValues: {
                campusId: null,
                campus: null,
            },
        });
    }

    render() {
        // Break out the state of our student
        const { id, campusId } = this.state;
        const originCampusId = this.state.preValues.campusId;
        const originCampus = this.state.preValues.campus;
        const { allCampuses } = this.props;

        return (
            <div className="main-view-list-student main-view-backdrop">
                <h2>Campus Information</h2>
                <form
                    onSubmit={() => this.submitRegistrationChange(event)}
                    className="student-detail-campus-change"
                >
                    <div className="student-detail-campus-feedback">
                        {originCampusId
                            ? "This Student is registered to a campus"
                            : "This Student is not registered to a campus"}
                    </div>
                    <div className="student-detail-campus-info">
                        {originCampusId ? (
                            <div className="student-detail-campus-card">
                                <CampusCard
                                    key={this.state.preValues.campusId}
                                    {...originCampus}
                                    unregister={true}
                                    studentId={id}
                                    resetSelect={this.resetSelect}
                                />
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="student-detail-campus-edit">
                            <select
                                name="CampusId"
                                onChange={() => this.handleChange(event)}
                                style={{ width: "30vh" }}
                                value={campusId || 0}
                            >
                                {!originCampusId ? (
                                    // If no original campus, start off with "Select Campus..."
                                    <option value={0} disabled>
                                        Select Campus...
                                    </option>
                                ) : (
                                    // Otherwise, include a "None" option
                                    <option value={""}>None</option>
                                )}
                                {allCampuses.map((campus) => (
                                    <option key={campus.id} value={campus.id}>
                                        {campus.name}
                                    </option>
                                ))}
                            </select>
                            <button className="add-btn">Change Campus</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        allCampuses: state.campusInfo.allCampuses,
        newStudent: state.studentInfo.selectedStudent,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeRegistration: (payload) =>
            dispatch(changeStudentCampusInDatabase(payload)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(StudentCampusModule);
