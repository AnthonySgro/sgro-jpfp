import React, { Component } from "react";

// React Router Imports
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";

// Redux Imports
import { connect } from "react-redux";
import { fetchAllCampuses } from "../store/campus";
import { fetchAllStudents } from "../store/student";

// Components
import Loading from "./Loading.jsx";
import NotFound from "./NotFound.jsx";
import Header from "./Header.jsx";
import HomePage from "./Homepage/Homepage.jsx";
import AboutUs from "./AboutUs.jsx";
import CampusListing from "./CampusViews/CampusListing.jsx";
import CampusDetail from "./CampusViews/CampusDetail.jsx";
import CampusAdd from "./Forms/CampusAdd.jsx";
import StudentListing from "./StudentViews/StudentListing.jsx";
import StudentDetail from "./StudentViews/StudentDetail.jsx";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    async componentDidMount() {
        // Fetches all the campuses and students when app mounts
        await this.props.loadAllCampuses();
        await this.props.loadAllStudents();
        this.setState({
            ...this.state,
            loading: false,
        });
    }

    render() {
        const { displayedStudents, displayedCampuses } = this.props;
        return (
            <Router>
                <React.Fragment>
                    <Header />
                    <main className="listing-main">
                        <Switch>
                            <Route exact path="/" component={HomePage} />
                            <Route
                                exact
                                path="/campuses"
                                render={() => (
                                    <CampusListing
                                        campuses={displayedCampuses}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/campuses/add"
                                component={CampusAdd}
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
                                    <StudentListing
                                        students={displayedStudents}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/students/:id"
                                component={StudentDetail}
                            />

                            {/* About us page and route to test load animation for fun */}
                            <Route exact path="/about-us" component={AboutUs} />
                            <Route exact path="/loading" component={Loading} />
                            <Route component={NotFound} />
                        </Switch>
                    </main>
                </React.Fragment>
            </Router>
        );
    }
}

function mapStateToProps(state) {
    return {
        displayedStudents: state.studentInfo.displayedStudents,
        displayedCampuses: state.campusInfo.displayedCampuses,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadAllCampuses: () => dispatch(fetchAllCampuses()),
        loadAllStudents: () => dispatch(fetchAllStudents()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
