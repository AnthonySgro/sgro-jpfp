import React, { Component } from "react";

// React Router Links
import { Link } from "react-router-dom";

// Redux Imports
import { connect } from "react-redux";
import { deleteStudentFromDatabase } from "../../store/student";

class StudentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { id, Campus, firstName, lastName, imgUrl } = this.props;
        const { deleteStudent } = this.props;

        return (
            <div className="student-card-container card-container">
                <img
                    src={imgUrl}
                    alt="Student Image"
                    className="student-card-image"
                />
                <Link
                    to={`/students/${id}`}
                    className="student-card-name student-card-info"
                >{`${firstName} ${lastName}`}</Link>

                {/* If campus is passed down, display that too */}
                {Campus ? (
                    <div>
                        <Link
                            to={`/campuses/${Campus.id}`}
                            className="student-card-campus student-card-info"
                        >
                            {Campus.name}
                        </Link>
                        <button onClick={() => deleteStudent(id)}>
                            Delete
                        </button>
                    </div>
                ) : (
                    <div>
                        <button onClick={() => deleteStudent(id)}>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteStudent: (id) => dispatch(deleteStudentFromDatabase(id)),
    };
}

export default connect(null, mapDispatchToProps)(StudentCard);
