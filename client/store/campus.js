import axios from "axios";

// Action Types
const LOAD_All_CAMPUSES = "LOAD_ALL_CAMPUSES";
const LOAD_CAMPUS_DETAIL = "LOAD_CAMPUS_DETAIL";

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

// Initial Reducer State
const initialState = { allCampuses: [], selectedCampus: {} };

// Campuses Reducer
export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_All_CAMPUSES:
            return (state = { ...state, allCampuses: action.campuses });
        case LOAD_CAMPUS_DETAIL:
            return (state = { ...state, selectedCampus: action.campus });
        default:
            return state;
    }
};
