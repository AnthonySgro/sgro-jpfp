import React, { Component } from "react";

// Redux imports
import { connect } from "react-redux";
import { addStudentToDatabase } from "../../store/student";

// Function Imports
import studentFormValidator, {
    resetStudentFormStyles,
} from "./studentFormValidator";

class StudentAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            imgUrl: "",
            campusName: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.backBtn = this.backBtn.bind(this);
    }

    backBtn() {
        this.props.removeAdder();

        // Reset styles after the form disappears
        setTimeout(() => {
            resetStudentFormStyles();
        }, 200);
    }

    handleSubmit(event) {
        // Prevents the form from submitting normally
        event.preventDefault();

        const allValid = studentFormValidator(this.props.allStudents);
        if (allValid) {
            // Submits the data to our redux thunk which makes the post request
            this.props.addStudent(this.state);

            // Resets our state to blank
            this.setState({
                firstName: "",
                lastName: "",
                email: "",
                imgUrl: "",
                campusName: "",
            });
        }
    }

    // Modifies the state to reflect current text in input fields
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        const { allCampuses } = this.props;
        const { firstName, lastName, email, campusName } = this.state;
        return (
            <div className="container">
                <form id="form" className="form" onSubmit={this.handleSubmit}>
                    <h2>Enroll Student</h2>
                    <div className="form-control">
                        <div className="form-control">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                value={firstName}
                                onChange={this.handleChange}
                                id="student-firstname-input"
                                name="firstName"
                                type="text"
                                placeholder="Enter first name"
                            />
                            <small>Error message</small>
                        </div>
                        <div className="form-control">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                value={lastName}
                                onChange={this.handleChange}
                                name="lastName"
                                id="student-lastname-input"
                                type="text"
                                placeholder="Enter last name"
                            />
                            <small>Error message</small>
                        </div>
                        <div className="form-control">
                            <label htmlFor="email">Email</label>
                            <input
                                value={email}
                                onChange={this.handleChange}
                                name="email"
                                id="student-email-input"
                                type="text"
                                placeholder="Enter email"
                            ></input>
                            <small>Error message</small>
                        </div>
                        <div className="form-control">
                            <label htmlFor="imgUrl">Profile Picture</label>
                            <input
                                value={this.state.imgUrl}
                                onChange={this.handleChange}
                                id="campus-imgUrl-input"
                                name="imgUrl"
                                type="text"
                                placeholder="Enter profile image URL"
                            />
                            <small>Error message</small>
                        </div>
                        <div className="form-control">
                            <label htmlFor="campusName">Campus Name</label>
                            <select
                                name="campusName"
                                id="student-campus-input"
                                value={campusName}
                                onChange={this.handleChange}
                            >
                                <option value={0}>No Campus</option>
                                {allCampuses.map((campus) => (
                                    <option key={campus.id} value={campus.name}>
                                        {campus.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="submit-btn">
                        Submit
                    </button>
                    <button
                        type="button"
                        className="back-btn"
                        onClick={this.backBtn}
                    >
                        {"<"}
                    </button>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        allCampuses: state.campusInfo.allCampuses,
        allStudents: state.studentInfo.allStudents,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addStudent: (studentData) =>
            dispatch(addStudentToDatabase(studentData)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentAdd);
