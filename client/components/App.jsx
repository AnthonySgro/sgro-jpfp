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
import CampusDetail from "./CampusViews/CampusDetail.jsx";
import StudentListing from "./StudentViews/StudentListing.jsx";
import StudentDetail from "./StudentViews/StudentDetail.jsx";

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
        const { students } = this.props;
        return (
            <Router>
                <React.Fragment>
                    <Header />
                    <main className="listing-main">
                        <Switch>
                            <Route
                                exact
                                path="/campuses"
                                component={CampusListing}
                            />
                            <Route
                                exact
                                path="/campuses/:id"
                                component={CampusDetail}
                            />
                            <Route
                                exact
                                path="/students"
                                render={() => (
                                    <StudentListing students={students} />
                                )}
                            />
                            <Route
                                exact
                                path="/students/:id"
                                component={StudentDetail}
                            />
                        </Switch>
                    </main>
                </React.Fragment>
            </Router>
        );
    }
}

function mapStateToProps(state) {
    return {
        students: state.studentInfo.allStudents,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadAllCampuses: () => dispatch(fetchAllCampuses()),
        loadAllStudents: () => dispatch(fetchAllStudents()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
