import React, { Component } from "react";

// React Router Links
import { Link } from "react-router-dom";

class CampusCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { id, name, imgUrl, description, studentCount } = this.props;

        // Pluralize student count corrently
        const plural = studentCount !== "1";

        return (
            <div className="campus-card-container card-container">
                <div className="campus-card-image-container">
                    <img src={imgUrl} alt="Campus Image" />
                </div>
                <div className="campus-card-info-container">
                    <div className="campus-card-info-text">
                        <Link to={`/campuses/${id}`}>{name}</Link>
                        <p className="campus-card-numStudents">
                            {`${studentCount} ${
                                plural ? "Students" : "Student"
                            } `}
                        </p>
                    </div>
                    <div className="campus-card-info-interact">
                        <Link to={`/campuses/${id}/edit`}>Edit</Link>
                        <button>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default CampusCard;
