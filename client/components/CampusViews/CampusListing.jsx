import React, { Component } from "react";

// Component Imports
import CampusCard from "../Cards/CampusCard.jsx";
import CampusAdd from "../Forms/CampusAdd.jsx";
import Loading from "../Loading.jsx";

// Redux imports
import { connect } from "react-redux";

class CampusListing extends Component {
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

        if (container.length) {
            container[0].classList.remove("container-highlighted");
        }
    }

    render() {
        const { campuses } = this.props;

        return (
            <React.Fragment>
                <div className="listing-lander">
                    <div className="listing-lander-content-box">
                        <h1 className="listing-lander-title">Campuses</h1>
                        <p className="listing-lander-text secondline">
                            Here's your Michelin-starred McFlurry, dear. Now
                        </p>
                        <p className="listing-lander-text secondline">
                            don't let that credit card decline before you
                            bulldoze
                        </p>
                        <p className="listing-lander-text secondline">
                            Penn State. You know what they say...
                        </p>
                        <p className="listing-lander-text secondline finalline">
                            Soul is salesmanship.
                        </p>
                    </div>
                    <div className="listing-lander-fun-box">
                        <img src={`/images/bookBlackAndWhite.jpg`} alt="" />
                    </div>
                </div>
                <div className="main-listing-view">
                    {campuses === undefined ? (
                        <Loading />
                    ) : (
                        <div className="main-view-chunk">
                            <CampusAdd removeAdder={this.removeAdder} />
                            <nav className="main-view-sidebar">
                                <h2>Menu</h2>
                                <button
                                    className="add-btn add-after-listings"
                                    onClick={this.highlightAdder}
                                >
                                    Build Campus
                                </button>
                            </nav>
                            <div className="main-view-list-campus">
                                <h2>All Campuses</h2>
                                {campuses.length > 0 ? (
                                    // If there are campuses, render cards
                                    <div className="main-view-listings-container">
                                        {campuses.map((campus) => (
                                            <CampusCard
                                                key={campus.id}
                                                {...campus}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    // If there are no campuses, display this message
                                    <React.Fragment>
                                        <div className="main-view-listings-container">
                                            There are no campuses registered in
                                            the database
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        campuses: state.campusInfo.allCampuses,
    };
}

export default connect(mapStateToProps)(CampusListing);
