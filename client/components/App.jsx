import React, { Component } from "react";

// React Router Imports
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";

// Redux Imports
import { connect } from "react-redux";
import { fetchAllCampuses } from "../store/campus";
import { fetchAllStudents } from "../store/student";

// Components
import Header from "./Header.jsx";
import CampusListing from "./CampusViews/CampusListing.jsx";
import StudentListing from "./StudentViews/StudentListing.jsx";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // Fetches all the campuses
        this.props.loadAllCampuses();
        this.props.loadAllStudents();
    }

    render() {
        return (
            <Router>
                <React.Fragment>
                    <Header />
                    <Switch>
                        <Route
                            exact
                            path="/campuses"
                            component={CampusListing}
                        />
                        <Route
                            exact
                            path="/students"
                            component={StudentListing}
                        />
                    </Switch>
                </React.Fragment>
            </Router>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadAllCampuses: () => dispatch(fetchAllCampuses()),
        loadAllStudents: () => dispatch(fetchAllStudents()),
    };
}

export default connect(null, mapDispatchToProps)(App);
