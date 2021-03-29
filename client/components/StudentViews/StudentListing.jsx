import React, { Component } from "react";

// Redux imports
import { connect } from "react-redux";
import { fetchAllStudents } from "../../store/student.js";

// Component Imports
import StudentCard from "../Cards/StudentCard.jsx";
import Sidebar from "../Sidebar.jsx";
import Loading from "../Loading.jsx";
import StudentListingHeader from "../ListingHeaders/StudentListingHeader.jsx";

class StudentListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    // We want to get all the students when we go to this page
    async componentDidMount() {
        // I know this doesn't do anything now, it's just here for
        // the cool loading screen. Does help make component look
        // nice if the array mapping takes a while
        await this.props.loadAllStudents();

        this.setState({
            ...this.state,
            loading: false,
        });
    }

    render() {
        const { loading } = this.state;
        const { students } = this.props;

        return (
            <React.Fragment>
                <StudentListingHeader />
                <div className="main-listing-view">
                    <div className="main-view-chunk">
                        <Sidebar student={true} />
                        <div className="main-view-list-campus">
                            {/* Displays loading page if loading */}
                            {loading ? (
                                <Loading />
                            ) : (
                                <React.Fragment>
                                    <h2>All Students</h2>
                                    {students.length ? (
                                        // If there are students, render cards
                                        <div className="main-view-listings-container">
                                            {students.map((student) => (
                                                <StudentCard
                                                    key={student.id}
                                                    {...student}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        // If there are no campuses, display this message
                                        <React.Fragment>
                                            <div className="main-view-listings-container">
                                                There are no students registered
                                                in the database
                                            </div>
                                        </React.Fragment>
                                    )}
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        allStudents: state.studentInfo.allStudents,
        displayedStudents: state.studentInfo.displayedStudents,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadAllStudents: () => dispatch(fetchAllStudents()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentListing);
