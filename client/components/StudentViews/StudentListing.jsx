import React, { Component } from "react";

// Component Imports
import StudentCard from "../Cards/StudentCard.jsx";

// Redux imports
import { connect } from "react-redux";

class StudentListing extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    render() {
        const { students } = this.props;
        console.log(this.props);

        return (
            <main className="listing-main">
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
                    <p>There are no campuses registered in the database</p>
                )}
            </main>
        );
    }
}

function mapStateToProps(state) {
    return {
        students: state.studentInfo.allStudents,
    };
}

export default connect(mapStateToProps)(StudentListing);
