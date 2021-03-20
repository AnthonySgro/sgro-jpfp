import axios from "axios";

// Action Type
const LOAD_All_CAMPUSES = "LOAD_ALL_CAMPUSES";

// Action Creator
export const loadAllCampuses = (campuses) => {
    return {
        type: LOAD_All_CAMPUSES,
        campuses,
    };
};

// Thunk
export const fetchAllCampuses = () => {
    // Fetches campuses from my api
    return async (dispatch) => {
        const campuses = (await axios.get("/api/campuses")).data;

        // Dispatches the action to all reducers
        dispatch(loadAllCampuses(campuses));
    };
};

// Initial Reducer State
const initialState = { allcampuses: [], selectedCampus: {} };

// Campuses Reducer
export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_All_CAMPUSES:
            return (state = { ...state, allCampuses: action.campuses });
        default:
            return state;
    }
};
