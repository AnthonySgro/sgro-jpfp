import React, { Component } from "react";

// Component Imports
import StudentProfile from "./DetailParts/StudentProfile.jsx";
import StudentCampusModule from "./DetailParts/StudentCampusModule.jsx";
import Loading from "../Loading.jsx";

// Redux Imports
import { connect } from "react-redux";
import { fetchStudentDetail } from "../../store/student";
import { fetchAllCampuses } from "../../store/campus";

class StudentDeets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: {
                // Id from react router
                id: parseInt(props.match.params.id),
                firstName: "",
                lastName: "",
                gpa: "",
                email: "",
                imgUrl: "",
                Campus: null,
                CampusId: 0,
            },
            Campus: null,
            loading: true,
        };
    }

    // Hydrates our page on first render
    async componentDidMount() {
        // Get props to load campus
        const { id } = this.state.student;
        const { loadStudent, loadAllCampuses } = this.props;

        // Dispatches to redux store and calls server for data
        await loadStudent(id);

        // Synchronizes local state with redux store selected student state
        const { selectedStudent } = this.props;

        // If someone navigated directly to this page and hasn't loaded all the campuses
        if (!this.props.allCampuses.length) {
            await loadAllCampuses();
        }

        // Finds the full campus
        const selectedCampus = this.props.allCampuses.find((campus) => {
            return campus.id === selectedStudent.CampusId;
        });

        this.setState({
            student: { ...selectedStudent },
            Campus: selectedCampus,
            loading: false,
        });
    }

    render() {
        // Displays loading animation
        if (this.state.loading) {
            return (
                <div className="info-detail-profile">
                    <Loading />
                </div>
            );
        }

        // Displays component
        return (
            <div className="info-detail-main">
                <StudentProfile
                    id={this.state.student.id}
                    history={this.props.history}
                    student={this.state.student}
                />
                <StudentCampusModule
                    id={this.state.student.id}
                    campus={this.state.Campus}
                    campusId={this.state.student.CampusId}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        selectedStudent: state.studentInfo.selectedStudent,
        allCampuses: state.campusInfo.allCampuses,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadStudent: (id) => dispatch(fetchStudentDetail(id)),
        loadAllCampuses: () => dispatch(fetchAllCampuses()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentDeets);
