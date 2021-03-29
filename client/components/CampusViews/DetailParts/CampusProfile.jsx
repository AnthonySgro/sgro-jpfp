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
            editing: false,
            styles: {
                editLabel: "Edit",
                saveChangesStyles: {
                    visibility: "hidden",
                    position: "absolute",
                },
                textAreaStyles: {
                    resize: "none",
                },
                nameInput: {
                    backgroundColor: "",
                },
                addressInput: {
                    backgroundColor: "",
                },
                descriptionInput: {
                    backgroundColor: "",
                },
            },
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitDelete = this.submitDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);
        this.isEmptyValidator = this.isEmptyValidator.bind(this);
    }

    // Dispatches update student event
    async handleSubmit(event) {
        // Prevents the form from submitting normally
        event.preventDefault();

        const { name, address } = this.state.campus;

        // Check if name and address are populated
        const allValid = this.isEmptyValidator(name, address);

        if (allValid) {
            // Submits the updated student data to our redux thunk for post request
            const { campus } = this.state;
            await this.props.updateCampus({ ...campus });

            // Revert editing windows
            this.toggleEditing();

            // If successful (not implemented yet), reset our state to be in sync with the database
            this.setState({
                ...this.state,
                campus: { ...campus },
                preValues: { ...campus },
            });
        }
    }

    // Dispatches Delete Campus
    async submitDelete() {
        const { triggerLoading, deleteCampus, history } = this.props;

        // Trigger loading component if delete takes more than 50 milliseconds
        triggerLoading(50);

        // Deletes Campus
        await deleteCampus(this.state.campus.id);

        // Redirects
        history.push(`/campuses`);
    }

    // Modify the state with a controlled form
    handleChange(event) {
        const { campus, styles } = this.state;

        // Set new values for whatever user typed in
        this.setState(
            {
                ...this.state,
                campus: {
                    ...campus,
                    [event.target.name]: event.target.value,
                },
            },

            // Afterwards, get user feedback styles after values are set
            () => {
                const { name, address } = this.state.campus;

                const nameBackground = this.isEmptyValidator(name)
                    ? "#ffffff"
                    : "#ff9999";

                const addressBackground = this.isEmptyValidator(address)
                    ? "#ffffff"
                    : "#ff9999";

                this.setState({
                    styles: {
                        ...styles,
                        nameInput: {
                            backgroundColor: nameBackground,
                        },
                        addressInput: {
                            backgroundColor: addressBackground,
                        },
                    },
                });
            },
        );
    }

    // Returns true if all arguments are valid, false if any are invalid
    isEmptyValidator(...args) {
        console.log(args);
        for (let arg of args) {
            if (!arg.trim()) {
                return false;
            }
        }

        return true;
    }

    // Handles edit style toggling
    toggleEditing() {
        const { editing } = this.state;

        // Gets the styles
        const backgroundColor = editing ? "" : "#ffffff";
        const editLabel = editing ? "Edit" : "Disregard Changes";
        const saveChangesStyles = editing
            ? {
                  visibility: "hidden",
                  position: "absolute",
                  display: "none",
              }
            : {
                  visibility: "visible",
                  position: "static",
              };

        // If user pressed editing again, disregard changes
        const campus = editing
            ? { ...this.state.preValues }
            : { ...this.state.campus };

        this.setState({
            ...this.state,
            campus,
            editing: !editing,
            styles: {
                ...this.state.styles,
                saveChangesStyles,
                editLabel,
                nameInput: { backgroundColor },
                addressInput: { backgroundColor },
                descriptionInput: { backgroundColor },
            },
        });
    }

    render() {
        // Break out the state of our student
        const { name, address, description, imgUrl } = this.state.campus;

        // Break out the state of other styling elements we want to track
        const {
            textAreaStyles,
            editLabel,
            saveChangesStyles,
            nameInput,
            addressInput,
            descriptionInput,
        } = this.state.styles;

        // Editing
        const { editing } = this.state;

        return (
            <div className="info-detail-profile">
                <div className="info-detail-img-container">
                    <img src={imgUrl} alt="" className="info-detail-img" />
                </div>
                <form onSubmit={this.handleSubmit} className="detail-form">
                    <div className="info-detail-text">
                        <div className="info-detail-name">
                            <textarea
                                id="campus-name-editor"
                                type="text"
                                className="info-detail-title disabled"
                                name="name"
                                disabled={!editing}
                                rows={name ? (name.length > 20 ? 2 : 1) : 1}
                                cols="20"
                                style={{ ...textAreaStyles, ...nameInput }}
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
                                    disabled={!editing}
                                    style={{
                                        width: address
                                            ? address.length + "ch"
                                            : "0ch",
                                        ...addressInput,
                                    }}
                                    value={address}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="info-detail-description-container">
                                <p>Description: </p>{" "}
                                <textarea
                                    id="description-editor"
                                    type="text"
                                    className="info-detail-information disabled"
                                    name="description"
                                    disabled={!editing}
                                    rows="5"
                                    cols="30"
                                    style={{
                                        ...textAreaStyles,
                                        ...descriptionInput,
                                        width: "80%",
                                        height: "100%",
                                    }}
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
                                className="card-delete-button profile-button"
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
