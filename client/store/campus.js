import axios from "axios";

// Import redux actions
import { fetchAllStudents } from "./student";

// Import helper functions
import incrementStudents from "./functions/incrementStudents";
import replaceCampus from "./functions/replaceCampus";

// Action Types
const LOAD_All_CAMPUSES = "LOAD_ALL_CAMPUSES";
const LOAD_CAMPUS_DETAIL = "LOAD_CAMPUS_DETAIL";
const ADD_CAMPUS = "ADD_CAMPUS";
const DELETE_CAMPUS = "DELETE_CAMPUS";
const UPDATE_CAMPUS = "UPDATE_CAMPUS";

const ADD_STUDENT = "ADD_STUDENT";
const DELETE_STUDENT = "DELETE_STUDENT";
const UPDATE_REGISTRATION = "UPDATE_REGISTRATION";

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

export const addCampus = (campus) => {
    return {
        type: ADD_CAMPUS,
        campus,
    };
};

export const deleteCampus = (campusId) => {
    return {
        type: DELETE_CAMPUS,
        campusId,
    };
};

export const updateCampus = (campus) => {
    return {
        type: UPDATE_CAMPUS,
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

export const addCampusToDatabase = (campusData) => {
    return async (dispatch) => {
        // Attempts to add the campus to the database, then grabs all campuses in database
        const { data: newCampus } = await axios.post(
            `/api/campuses`,
            campusData,
        );

        // Dispatches the add campus event
        dispatch(addCampus(newCampus));
    };
};

export const deleteCampusFromDatabase = (id) => {
    return async (dispatch) => {
        // Attempts to delete the campus from the database, then grabs all campuses in database
        await axios.delete(`/api/campuses/${id}`);

        // Dispatches the delete campus event
        dispatch(deleteCampus(id));
    };
};

export const updateCampusInDatabase = (payload) => {
    return async (dispatch) => {
        // Attempts to update the student in the database, then grabs that student
        const { data: campus } = await axios.put(
            `/api/campuses/${payload.id}`,
            payload,
        );

        // Dispatches the action to all reducers
        dispatch(updateCampus(campus));
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
            return (state = {
                ...state,
                allCampuses: [...state.allCampuses, action.campus],
                selectedCampus: action.campus,
            });
        case DELETE_CAMPUS: {
            const newAllCampuses = state.allCampuses.filter(
                (campus) => campus.id !== action.campusId,
            );

            const newSelectedCampus =
                state.selectedCampus.id === action.campusId
                    ? {}
                    : state.selectedCampus;

            return (state = {
                allCampuses: [...newAllCampuses],
                selectedCampus: newSelectedCampus,
            });
        }
        case UPDATE_CAMPUS:
            return replaceCampus(state, action.campus);
        case ADD_STUDENT:
            return incrementStudents(state, action.newStudent.CampusId, 1);
        case DELETE_STUDENT: {
            if (action.studentCampus) {
                return incrementStudents(state, action.studentCampus.id, -1);
            } else {
                return state;
            }
        }
        case UPDATE_REGISTRATION:
            // If the campus id is null, it just returns the state
            const midState = incrementStudents(state, action.newCampusId, 1);
            return incrementStudents(midState, action.oldCampusId, -1);
        default:
            return state;
    }
};
