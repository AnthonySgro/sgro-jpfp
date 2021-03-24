import React, { Component } from "react";

// Component Imports
import StudentCard from "../Cards/StudentCard.jsx";
import StudentAdd from "../Forms/StudentAdd.jsx";

// Redux imports
import { connect } from "react-redux";

class StudentListing extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.highlightAdder = this.highlightAdder.bind(true);
        this.removeAdder = this.removeAdder.bind(true);
    }

    componentDidMount() {}

    highlightAdder() {
        const container = document.querySelectorAll(".container");
        container[0].classList.add("container-highlighted");
    }

    removeAdder() {
        const container = document.querySelectorAll(".container");
        container[0].classList.remove("container-highlighted");
    }

    render() {
        // Receive students as props
        let { students } = this.props;

        // const studentsUndefined = students === undefined;

        // // If props weren't passed down, default to all students from store
        // const displayStudents = studentsUndefined
        //     ? this.props.storeStudents
        //     : students;

        // if (displayStudents === undefined) {
        //     return "loading...";
        // }

        return (
            <React.Fragment>
                <div className="listing-lander">
                    <div className="listing-lander-content-box">
                        <h1 className="listing-lander-title">Students</h1>
                        <p className="listing-lander-text secondline">
                            Math is for mice and the alphabet is for dummies.
                            Enter
                        </p>
                        <p className="listing-lander-text secondline">
                            the secret Luxembourgish childhood dystopia: enroll
                        </p>
                        <p className="listing-lander-text secondline">
                            your little Jimmy in Harvard today. He deserves it.
                        </p>
                        <p className="listing-lander-text secondline finalline">
                            You deserve it.
                        </p>
                    </div>
                    <div className="listing-lander-fun-box">
                        <img src={`/images/darkAcademia.jpeg`} alt="" />
                    </div>
                </div>
                <div className="main-listing-view">
                    <div className="main-view-chunk">
                        <StudentAdd removeAdder={this.removeAdder} />
                        <nav className="main-view-sidebar">
                            <h2>Menu</h2>
                            <button
                                className="add-btn add-after-listings"
                                onClick={this.highlightAdder}
                            >
                                Enroll Student
                            </button>
                        </nav>
                        <div className="main-view-list-campus">
                            <h2>All Students</h2>
                            {students.length > 0 ? (
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
                                        There are no students registered in the
                                        database
                                    </div>
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
        storeStudents: state.studentInfo.allStudents,
    };
}

export default connect(mapStateToProps, null)(StudentListing);
