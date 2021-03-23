import React, { Component } from "react";

// Redux imports
import { connect } from "react-redux";
import { addCampusToDatabase } from "../../store/campus";

class CampusAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            address: "",
            description: "",
            imgUrl: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        // Prevents the form from submitting normally
        event.preventDefault();

        // Submits the data to our redux thunk which makes the post request
        this.props.addCampus(this.state);
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
                    <h2>Add Campus</h2>
                    <div className="form-control">
                        <div className="form-control">
                            <label htmlFor="name">Campus Name</label>
                            <input
                                value={this.state.name}
                                onChange={this.handleChange}
                                id="campus-name-input"
                                name="name"
                                type="text"
                                placeholder="Enter campus name"
                            />
                            <small>Error message</small>
                        </div>
                        <div className="form-control">
                            <label htmlFor="address">Address</label>
                            <input
                                value={this.state.address}
                                onChange={this.handleChange}
                                name="address"
                                id="campus-address-input"
                                type="text"
                                placeholder="Enter campus address"
                            />
                            <small>Error message</small>
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea
                                value={this.state.description}
                                onChange={this.handleChange}
                                name="description"
                                id="campus-description-input"
                                type="text"
                                placeholder="Enter description"
                            ></textarea>
                            <small>Error message</small>
                        </div>
                        <div className="form-control">
                            <label htmlFor="imgUrl">Campus Image</label>
                            <input
                                value={this.state.imgUrl}
                                onChange={this.handleChange}
                                id="campus-imgUrl-input"
                                name="imgUrl"
                                type="text"
                                placeholder="Enter campus image URL"
                            />
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
        addCampus: (campusData) => dispatch(addCampusToDatabase(campusData)),
    };
}

export default connect(null, mapDispatchToProps)(CampusAdd);
