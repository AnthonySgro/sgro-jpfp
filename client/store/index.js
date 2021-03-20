// Main Redux Imports
import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";

// Sub Reducers
import campusInfo from "./campus";
import studentInfo from "./student";

// Combined Reducer
const reducer = combineReducers({ campusInfo, studentInfo });

// Redux Middleware
const middleware = applyMiddleware(
    thunkMiddleware,
    createLogger({ collapsed: true }),
);

// Creates Redux Store
const store = createStore(reducer, middleware);
export default store;
