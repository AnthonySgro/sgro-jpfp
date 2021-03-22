import axios from "axios";

// Action Types
const LOAD_All_CAMPUSES = "LOAD_ALL_CAMPUSES";
const LOAD_CAMPUS_DETAIL = "LOAD_CAMPUS_DETAIL";
const ADD_CAMPUS = "ADD_CAMPUS";

// Action Creators
export const loadAllCampuses = (campuses) => {
    return {
        type: LOAD_All_CAMPUSES,
        campuses,
    };
};

export const loadCampusDetail = (campus) => {
    return {
        type: LOAD_CAMPUS_DETAIL,
        campus,
    };
};

export const addCampus = (campuses) => {
    return {
        type: ADD_CAMPUS,
        campuses,
    };
};

// Thunks
export const fetchAllCampuses = () => {
    // Fetches campuses from my api
    return async (dispatch) => {
        const campuses = (await axios.get("/api/campuses")).data;

        // Dispatches the action to all reducers
        dispatch(loadAllCampuses(campuses));
    };
};

export const fetchCampusDetail = (id) => {
    // Fetches campuses from my api
    return async (dispatch) => {
        const campus = (await axios.get(`/api/campuses/${id}`)).data;

        // Dispatches the action to all reducers
        dispatch(loadCampusDetail(campus));
    };
};

export const addCampusToDatabase = (campusData) => {
    return async (dispatch) => {
        // Attempts to add the campus to the database, then grabs all campuses in database
        (await axios.post(`/api/campuses`, campusData)).data;
        const campuses = (await axios.get("/api/campuses")).data;

        // Dispatches the add campus event
        dispatch(addCampus(campuses));
    };
};

// Initial Reducer State
const initialState = { allCampuses: [], selectedCampus: {} };

// Campuses Reducer
export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_All_CAMPUSES:
            return (state = { ...state, allCampuses: action.campuses });
        case LOAD_CAMPUS_DETAIL:
            return (state = { ...state, selectedCampus: action.campus });
        case ADD_CAMPUS:
            return (state = { ...state, allCampuses: action.campuses });
        default:
            return state;
    }
};
