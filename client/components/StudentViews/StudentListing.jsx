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
        // Receive students as props
        const { students } = this.props;
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
            </React.Fragment>
        );
    }
}

export default connect()(StudentListing);
