import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import { fetchStudentDetail } from "../../store/student";
import { fetchAllCampuses } from "../../store/campus";

// Component Imports
import CampusCard from "../Cards/CampusCard.jsx";

class StudentDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getStudentCampusDetails = this.getStudentCampusDetails.bind(this);
        this.getAllOtherCampuses = this.getAllOtherCampuses.bind(this);
    }

    componentDidMount() {
        // Get props to load campus
        const id = parseInt(this.props.match.params.id);
        const { loadStudent, loadAllCampuses } = this.props;

        // On mount, load student and all campuses
        loadStudent(id);
        loadAllCampuses();
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

    render() {
        // Deconstructs all information from campus store obj
        const { firstName, lastName, id, imgUrl, gpa } = this.props.student;

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
                    <img src={imgUrl} alt="" className="info-detail-img" />
                    <div className="info-detail-text">
                        <h1 className="info-detail-title">{`${firstName} ${lastName}`}</h1>
                        <p className="info-detail-information">{`GPA: ${gpa}`}</p>
                        <div className="info-detail-button-container">
                            <button className="edit-btn">Edit</button>
                            <button className="delete-btn">Delete</button>
                        </div>
                    </div>
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
                                    <option value={0}>Select Campus...</option>
                                    {allOtherCampuses.map((campus) => (
                                        <option value={campus.name}>
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
                                    <option value={0}>Select Campus...</option>
                                    {allOtherCampuses.map((campus) => (
                                        <option value={campus.name}>
                                            {campus.name}
                                        </option>
                                    ))}
                                </select>
                                <button>Change Campus</button>
                            </div>
                        </div>
                    </div>
                )}
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
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentDetail);
