import React, { Component } from "react";

// Component Imports
import StudentCard from "../Cards/StudentCard.jsx";
import StudentAdd from "../Forms/StudentAdd.jsx";

// Redux imports
import { connect } from "react-redux";

class StudentListing extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    render() {
        // Receive students as props
        let { students } = this.props;

        // const studentsUndefined = students === undefined;

        // // If props weren't passed down, default to all students from store
        // const displayStudents = studentsUndefined
        //     ? this.props.storeStudents
        //     : students;

        // if (displayStudents === undefined) {
        //     return "loading...";
        // }

        return (
            <React.Fragment>
                <div className="main-view-header">
                    <h1 className="main-view-title">All Students</h1>
                    <button className="main-view-btn">Add Student</button>
                </div>
                <br />
                {/* If there are campuses, render a card for each */}
                {students.length > 0 ? (
                    <div className="campus-listings-container">
                        {students.map((student) => (
                            <StudentCard key={student.id} {...student} />
                        ))}
                    </div>
                ) : (
                    // If there are no campuses, display this message
                    <p>There are no students registered in the database</p>
                )}
                <StudentAdd />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        storeStudents: state.studentInfo.allStudents,
    };
}

export default connect(mapStateToProps, null)(StudentListing);
