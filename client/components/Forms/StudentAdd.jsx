import React, { Component } from "react";

// Redux imports
import { connect } from "react-redux";
import { addStudentToDatabase } from "../../store/student";

class StudentAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        // Prevents the form from submitting normally
        event.preventDefault();

        // Submits the data to our redux thunk which makes the post request
        this.props.addStudent(this.state);
    }

    // Modifies the state to reflect current text in input fields
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        return (
            <div className="container">
                <form id="form" className="form" onSubmit={this.handleSubmit}>
                    <h2>Enter Student</h2>
                    <div className="form-control">
                        <div className="form-control">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                value={this.state.firstName}
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
                                value={this.state.lastName}
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
                                value={this.state.email}
                                onChange={this.handleChange}
                                name="email"
                                id="student-email-input"
                                type="text"
                                placeholder="Enter email"
                            ></input>
                            <small>Error message</small>
                        </div>
                    </div>
                    <button type="submit" id="btn">
                        Submit
                    </button>
                </form>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addStudent: (studentData) =>
            dispatch(addStudentToDatabase(studentData)),
    };
}

export default connect(null, mapDispatchToProps)(StudentAdd);
