import React, { Component } from "react";

// React Router Links
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { deleteCampusFromDatabase } from "../../store/campus";

class CampusCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { id, name, imgUrl, description, studentCount } = this.props;
        const { deleteCampus } = this.props;

        // Pluralize student count corrently
        const plural = studentCount !== "1";

        return (
            <div className="campus-card-container card-container">
                <div className="campus-card-image-container">
                    <img src={imgUrl} alt="Campus Image" />
                </div>
                <div className="campus-card-info-container">
                    <div className="campus-card-info-text">
                        <Link
                            to={`/campuses/${id}`}
                            className="card-detail-link"
                        >
                            {name}
                        </Link>
                        <p className="campus-card-numStudents">
                            {`${studentCount} ${
                                plural ? "Students" : "Student"
                            } `}
                        </p>
                    </div>
                    <div className="campus-card-info-interact">
                        <Link
                            to={`/campuses/${id}/edit`}
                            className="card-edit-link"
                        >
                            Edit
                        </Link>
                        <button
                            className="card-delete-button"
                            onClick={() => deleteCampus(id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteCampus: (id) => dispatch(deleteCampusFromDatabase(id)),
    };
}

export default connect(null, mapDispatchToProps)(CampusCard);
