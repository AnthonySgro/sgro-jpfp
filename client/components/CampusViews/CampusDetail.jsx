import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import {
    fetchCampusDetail,
    deleteCampusFromDatabase,
    updateCampusInDatabase,
} from "../../store/campus";

// Component Imports
import StudentCard from "../Cards/StudentCard.jsx";
import CampusAdd from "../Forms/CampusAdd.jsx";
import StudentListing from "../StudentViews/StudentListing.jsx";

class CampusDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            address: "",
            id: "",
            editLabel: "Edit",
            saveChangesStyles: {
                visibility: "hidden",
                position: "absolute",
            },
            textAreaStyles: {
                resize: "none",
            },
            preValues: {
                name: "",
                description: "",
                address: "",
                id: "",
            },
        };
        this.enableEditing = this.enableEditing.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitDelete = this.submitDelete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Sets our state and loads information
    async componentDidMount() {
        // Get props to load campus
        const id = parseInt(this.props.match.params.id);
        const { loadCampus } = this.props;

        // On mount, load the specific campus here
        await loadCampus(id);

        const { name, description, address } = this.props.campus;

        this.setState({
            name,
            description,
            address,
            id,
            preValues: {
                name,
                description,
                address,
                id,
            },
        });
    }

    // Handles edit buttons
    enableEditing() {
        const inputs = document.getElementsByTagName("INPUT");
        const textAreas = document.getElementsByTagName("TEXTAREA");

        // Toggle editing styling
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
            const { preValues } = this.state;
            this.setState({
                name: preValues.name,
                description: preValues.description,
                address: preValues.address,
                editLabel: "Edit",
            });
            // If we are starting edit, display option to disregard changes
        } else {
            this.setState({
                editLabel: "Disregard Changes",
            });
        }

        // Toggles the visibility of our "save changes" button
        const { saveChangesStyles } = this.state;
        if (saveChangesStyles.visibility === "hidden") {
            this.setState({
                saveChangesStyles: {
                    visibility: "visible",
                    position: "static",
                },
                textAreaStyles: {
                    resize: "none",
                },
            });
        } else {
            this.setState({
                saveChangesStyles: {
                    visibility: "hidden",
                    position: "absolute",
                    display: "none",
                },
                textAreaStyles: {
                    resize: "none",
                },
            });
        }
    }

    // Modifies the state to reflect current text in input fields
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    // Handles delete button
    submitDelete(id) {
        const { deleteCampus } = this.props;
        deleteCampus(id);
        this.props.history.push(`/campuses`);
    }

    async handleSubmit(event) {
        // Prevents the form from submitting normally
        event.preventDefault();

        // Prepare payload
        const { name, description, address, id } = this.state;
        const payload = {
            name,
            description,
            address,
            id,
        };

        // Submits the data to our redux thunk which makes the post request
        await this.props.updateCampus(payload);

        // If successful (not implemented yet), reset our state to be in sync with the database
        this.setState({
            name,
            description,
            address,
            preValues: { ...payload },
        });

        // Reverts our styling to pre-editing
        this.enableEditing();
    }

    render() {
        // Deconstructs all information from campus store obj
        const {
            name,
            description,
            id,
            imgUrl,
            street,
            city,
            state,
            zip,
            Students,
        } = this.props.campus;

        // Display loading screen until our axios call resolves
        if (!id) {
            return <p>Loading...</p>;
        }

        return (
            <React.Fragment>
                <div className="info-detail-main">
                    <div className="info-detail-profile">
                        <div className="info-detail-img-container">
                            <img
                                src={imgUrl}
                                alt=""
                                className="info-detail-img"
                            />
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
                                        rows={
                                            this.state.name.length > 20 ? 2 : 1
                                        }
                                        cols="20"
                                        style={this.state.textAreaStyles}
                                        value={this.state.name}
                                        onChange={() =>
                                            this.handleChange(event)
                                        }
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
                                                width:
                                                    this.state.address.length +
                                                    "ch",
                                            }}
                                            value={this.state.address}
                                            onChange={() =>
                                                this.handleChange(event)
                                            }
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
                                                (this.state.textAreaStyles,
                                                {
                                                    width: "100%",
                                                    height: "100%",
                                                })
                                            }
                                            value={this.state.description}
                                            onChange={() =>
                                                this.handleChange(event)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="info-detail-button-container">
                                    <a
                                        className="card-edit-link"
                                        onClick={this.enableEditing}
                                    >
                                        {this.state.editLabel}
                                    </a>
                                    <button
                                        type="submit"
                                        className="add-btn add-after-listings"
                                        id="save-changes"
                                        style={this.state.saveChangesStyles}
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        className="card-delete-button"
                                        onClick={() => this.submitDelete(id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="main-view-list-campus">
                        <h2>{`All Students (${Students.length})`}</h2>
                        {Students.length > 0 ? (
                            <div className="main-view-listings-container">
                                {Students.map((student) => (
                                    <StudentCard
                                        key={student.id}
                                        {...student}
                                        Campus={this.props.campus}
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
            </React.Fragment>
        );

        // // Page content
        // return (
        //     <React.Fragment>
        //         <div className="main-view-header">
        //             <h1 className="main-view-title">Campus Detail</h1>
        //         </div>
        //         <div className="main-view-chunk">
        //             <nav className="main-view-sidebar">
        //                 <CampusAdd />
        //             </nav>
        //             <div className="main-view-list-backdrop">
        //                 <div className="main-view-list-campus">
        //                     <div className="info-detail-main">
        //                         <img
        //                             src={imgUrl}
        //                             alt=""
        //                             className="info-detail-img"
        //                         />
        //                         <div className="info-detail-text">
        //                             <h1 className="info-detail-title">
        //                                 {name}
        //                             </h1>
        //                             <p className="info-detail-information">
        //                                 {description}
        //                             </p>
        //                         </div>
        //                     </div>
        //                     <div className="info-detail-additional">
        //                         <div className="info-detail-address-container">
        //                             <p className="info-detail-address-street">
        //                                 {street}
        //                             </p>
        //                             <p className="info-detail-address-citystate">
        //                                 {`${city}, ${state} ${zip}`}
        //                             </p>
        //                         </div>
        //                         <div className="info-detail-button-container">
        //                             <button className="edit-btn">Edit</button>
        //                             <button
        //                                 className="delete-btn"
        //                                 onClick={() => this.submitDelete(id)}
        //                             >
        //                                 Delete
        //                             </button>
        //                         </div>
        //                     </div>
        //                     <div className="detail-list-label-container">
        //                         <p className="detail-list-label">Students</p>
        //                     </div>
        //                     <div className="main-view-listings-container">
        //                         {Students.map((student) => (
        //                             <StudentCard
        //                                 key={student.id}
        //                                 {...student}
        //                                 Campus={this.props.campus}
        //                             />
        //                         ))}
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //         {/* */}
        //     </React.Fragment>
        // );
    }
}

function mapStateToProps(state) {
    return {
        campus: state.campusInfo.selectedCampus,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadCampus: (id) => dispatch(fetchCampusDetail(id)),
        deleteCampus: (id) => dispatch(deleteCampusFromDatabase(id)),
        updateCampus: (campus) => dispatch(updateCampusInDatabase(campus)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CampusDetail);
