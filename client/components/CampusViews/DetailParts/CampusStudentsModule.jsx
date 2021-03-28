import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import { changeStudentCampusInDatabase } from "../../../store/student";

// Component Imports
import StudentCard from "../../Cards/StudentCard.jsx";

class CampusStudentsModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            students: props.students,
            campus: props.campus,
        };
        this.unregisterStudent = this.unregisterStudent.bind(this);
    }

    async unregisterStudent(sId) {
        const { changeRegistration } = this.props;

        // Calls the update thunk with an empty id
        await changeRegistration({
            id: sId,
            newCampusId: 0,
            prevCampusId: this.state.id,
        });

        // Update the students in the state
        const newStudents = this.state.students.filter(
            (student) => student.id !== sId,
        );

        this.setState({ ...this.state, students: newStudents });
    }

    render() {
        const { students, campus } = this.state;
        return (
            <div className="main-view-list-campus">
                <h2>{`All Students (${students.length})`}</h2>
                {students.length > 0 ? (
                    <div
                        className="main-view-listings-container"
                        id="campus-module"
                    >
                        {students.map((student) => (
                            <StudentCard
                                key={student.id}
                                {...student}
                                Campus={campus}
                                unregisterStudent={this.unregisterStudent}
                            />
                        ))}
                    </div>
                ) : (
                    // If there are no campuses, display this message
                    <div className="main-view-listings-container">
                        There are no students registered in the database
                    </div>
                )}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeRegistration: (payload) =>
            dispatch(changeStudentCampusInDatabase(payload)),
    };
}

export default connect(null, mapDispatchToProps)(CampusStudentsModule);
