import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import {
    updateCampusInDatabase,
    deleteCampusFromDatabase,
} from "../../../store/campus";

class CampusProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            campus: { ...props.campus },
            preValues: { ...props.campus },
            styles: {
                editLabel: "Edit",
                saveChangesStyles: {
                    visibility: "hidden",
                    position: "absolute",
                },
                textAreaStyles: {
                    resize: "none",
                },
            },
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitDelete = this.submitDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);
    }

    // Dispatches update student event
    async handleSubmit(event) {
        // Prevents the form from submitting normally
        event.preventDefault();

        // Submits the updated student data to our redux thunk for post request
        const { campus } = this.state;
        await this.props.updateCampus({ ...campus });

        // Revert editing windows
        this.toggleEditing();

        // If successful (not implemented yet), reset our state to be in sync with the database
        this.setState({
            campus: { ...campus },
            preValues: { ...campus },
        });
    }

    // Dispatches Delete Campus
    async submitDelete() {
        // Deletes Campus
        await this.props.deleteCampus(this.state.campus.id);

        // Redirects
        this.props.history.push(`/campuses`);
    }

    // Modify the state with a controlled form
    handleChange(event) {
        const { campus } = this.state;
        this.setState({
            campus: {
                ...campus,
                [event.target.name]: event.target.value,
            },
        });
    }

    // Handles edit buttons
    toggleEditing() {
        const { campus, preValues } = this.state;
        const { saveChangesStyles, editLabel } = this.state.styles;

        // Toggles input editability
        const inputs = document.getElementsByTagName("INPUT");
        const textAreas = document.getElementsByTagName("TEXTAREA");

        // Toggle editing styling
        // WE CAN MERGE THESE BY USING A COMMON CLASS NAME: **TODO**
        for (let textArea of textAreas) {
            textArea.disabled = !textArea.disabled;
            textArea.classList.toggle("disabled");
        }
        for (let input of inputs) {
            input.disabled = !input.disabled;
            input.classList.toggle("disabled");
            input.classList.toggle("enabled");
        }

        // If we are disregarding changes, rever to the original values
        if (inputs[0].disabled === true) {
            this.setState({
                name: preValues.name,
                description: preValues.description,
                address: preValues.address,
                editLabel: "Edit",
            });
        }

        // Toggles our editing styling
        const newEditLabel =
            editLabel !== "Edit" ? "Edit" : "Disregard Changes";
        const newSaveChanges =
            saveChangesStyles.visibility === "hidden"
                ? {
                      visibility: "visible",
                      position: "static",
                  }
                : {
                      visibility: "hidden",
                      position: "absolute",
                      display: "none",
                  };

        // Toggles the visibility of our "save changes" button
        this.setState({
            styles: {
                editLabel: newEditLabel,
                saveChangesStyles: newSaveChanges,
                textAreaStyles: { resize: "none" },
            },
        });
    }

    render() {
        const { name, address, description, imgUrl } = this.state.campus;
        const {
            textAreaStyles,
            editLabel,
            saveChangesStyles,
        } = this.state.styles;

        return (
            <div className="info-detail-profile">
                <div className="info-detail-img-container">
                    <img src={imgUrl} alt="" className="info-detail-img" />
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div className="info-detail-text">
                        <div className="info-detail-name">
                            <textarea
                                id="campus-name-editor"
                                type="text"
                                className="info-detail-title disabled"
                                name="name"
                                disabled
                                rows={name ? (name.length > 20 ? 2 : 1) : 1}
                                cols="20"
                                style={textAreaStyles}
                                value={name}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="info-detail-information-container">
                            <h2 className="info-detail-subtitle">
                                Information
                            </h2>
                            <div className="info-detail-address-container">
                                <p>Address: </p>{" "}
                                <input
                                    id="address-editor"
                                    type="text"
                                    className="info-detail-information disabled"
                                    name="address"
                                    disabled
                                    style={{
                                        width: address
                                            ? address.length + "ch"
                                            : "0ch",
                                    }}
                                    value={address}
                                    onChange={() => this.handleChange(event)}
                                />
                            </div>
                            <div className="info-detail-description-container">
                                <p>Description: </p>{" "}
                                <textarea
                                    id="description-editor"
                                    type="text"
                                    className="info-detail-information disabled"
                                    name="description"
                                    disabled
                                    rows="7"
                                    cols="40"
                                    style={
                                        (textAreaStyles,
                                        {
                                            width: "100%",
                                            height: "100%",
                                        })
                                    }
                                    value={description}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                        <div className="info-detail-button-container">
                            <a
                                className="card-edit-link"
                                onClick={this.toggleEditing}
                            >
                                {editLabel}
                            </a>
                            <button
                                type="submit"
                                className="add-btn add-after-listings"
                                id="save-changes"
                                style={saveChangesStyles}
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className="card-delete-button"
                                onClick={this.submitDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteCampus: (id) => dispatch(deleteCampusFromDatabase(id)),
        updateCampus: (campus) => dispatch(updateCampusInDatabase(campus)),
    };
}

export default connect(null, mapDispatchToProps)(CampusProfile);
