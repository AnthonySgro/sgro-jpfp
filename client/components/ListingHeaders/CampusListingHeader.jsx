import React, { Component } from "react";

class CampusListingHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="listing-lander">
                <div className="listing-lander-content-box">
                    <h1 className="listing-lander-title">Campuses</h1>
                    <p className="listing-lander-text secondline">
                        Here's your Michelin-starred McFlurry, dear. Now
                    </p>
                    <p className="listing-lander-text secondline">
                        don't let that credit card decline before you bulldoze
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
        );
    }
}

export default CampusListingHeader;
