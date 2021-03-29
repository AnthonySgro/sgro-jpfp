import React, { Component } from "react";

// Component Imports
import StudentProfile from "./DetailParts/StudentProfile.jsx";
import StudentCampusModule from "./DetailParts/StudentCampusModule.jsx";
import Loading from "../Loading.jsx";
import NotFound from "../NotFound.jsx";

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

        this.triggerLoading = this.triggerLoading.bind(this);
    }

    // Hydrates our page on first render
    async componentDidMount() {
        // Get props to load student
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

    // Triggers the loading component for loading events after a set amount of time
    triggerLoading(ms) {
        setTimeout(() => {
            // Test element to see if this component is still waiting after ms
            const isStillShown = document.querySelector("#first-name-editor");

            // If yes, show the loading component
            if (isStillShown) {
                this.setState({
                    ...this.state,
                    loading: true,
                });
            }
        }, ms);
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

        // If we finished loading and id is nowhere to be found...
        if (!this.state.student.id) {
            return <NotFound />;
        }

        // Displays component
        return (
            <div className="info-detail-main">
                <StudentProfile
                    id={this.state.student.id}
                    history={this.props.history}
                    student={this.state.student}
                    triggerLoading={this.triggerLoading}
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
