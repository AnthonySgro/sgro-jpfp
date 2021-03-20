import React, { Component } from "react";

// React Router Links
import { Link } from "react-router-dom";

class StudentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { id, Campus, firstName, lastName, imgUrl } = this.props;

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
                <Link
                    to={`/campuses/${Campus.id}`}
                    className="student-card-campus student-card-info"
                >
                    {Campus.name}
                </Link>
            </div>
        );
    }
}

export default StudentCard;
