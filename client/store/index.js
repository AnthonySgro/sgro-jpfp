import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import thunkMiddleware from "redux-thunk";

import campusReducer from "./campus";
const reducer = combineReducers({ campusReducer });

const middleware = applyMiddleware(
    thunkMiddleware,
    createLogger({ collapsed: true }),
);

const store = createStore(reducer, middleware);

export default store;
