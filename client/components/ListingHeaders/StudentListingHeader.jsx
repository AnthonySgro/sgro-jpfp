import React, { Component } from "react";

class StudentListingHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="listing-lander">
                <div className="listing-lander-content-box">
                    <h1 className="listing-lander-title">Students</h1>
                    <p className="listing-lander-text secondline">
                        Math is for mice and the alphabet is for dummies. Enter
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
        );
    }
}

export default StudentListingHeader;
