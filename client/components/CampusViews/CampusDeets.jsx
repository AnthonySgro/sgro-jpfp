import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import { fetchCampusDetail } from "../../store/campus";
import { fetchAllStudents } from "../../store/student";

// Component Imports
import Loading from "../Loading.jsx";
import NotFound from "../NotFound.jsx";
import CampusProfile from "./DetailParts/CampusProfile.jsx";
import CampusStudentsModule from "./DetailParts/CampusStudentsModule.jsx";

class CampusDeets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            campus: {
                // Id from react router
                id: parseInt(props.match.params.id),
                name: "",
                description: "",
                address: "",
                street: "",
                city: "",
                state: "",
                zip: "",
            },
            students: [],
            loading: true,
        };
    }
    // Hydrates our page on first render
    async componentDidMount() {
        // Get props to load campus
        const { id } = this.state.campus;
        const { loadCampus, loadAllStudents } = this.props;

        // Dispatches to redux store and calls server for data
        await loadCampus(id);

        // If someone navigated directly to this page and hasn't loaded all the students
        if (!this.props.allStudents.length) {
            await loadAllStudents();
        }

        // Synchronizes local state with redux store students
        const students = this.props.allStudents.filter(
            (student) => student.CampusId === id,
        );

        this.setState({
            campus: { ...this.props.selectedCampus },
            students,
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
        // If we finished loading and id is nowhere to be found...
        if (!this.state.campus.id) {
            return <NotFound />;
        }

        // Displays component
        return (
            <div className="info-detail-main">
                <CampusProfile
                    id={this.state.campus.id}
                    history={this.props.history}
                    campus={this.state.campus}
                />

                <CampusStudentsModule
                    id={this.state.campus.id}
                    campus={this.state.campus}
                    students={this.state.students}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        selectedCampus: state.campusInfo.selectedCampus,
        allStudents: state.studentInfo.allStudents,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadCampus: (id) => dispatch(fetchCampusDetail(id)),
        loadAllStudents: () => dispatch(fetchAllStudents()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CampusDeets);
