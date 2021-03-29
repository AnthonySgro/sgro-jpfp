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

const SEARCH_CAMPUS_LISTING = "SEARCH_CAMPUS_LISTING";
const SORT_CAMPUSES = "SORT_CAMPUSES";
const FILTER_CAMPUSES = "FILTER_CAMPUSES";

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

export const searchCampusListing = (str) => {
    return {
        type: SEARCH_CAMPUS_LISTING,
        str,
    };
};

export const sortCampusListing = (str, order) => {
    return {
        type: SORT_CAMPUSES,
        str,
        order,
    };
};

export const filterCampusListing = (str, active) => {
    return {
        type: FILTER_CAMPUSES,
        str,
        active,
    };
};

// Thunks
export const fetchAllCampuses = () => {
    // Fetches campuses from my api
    return async (dispatch) => {
        try {
            const campuses = (await axios.get("/api/campuses")).data;

            // Dispatches the action to all reducers
            dispatch(loadAllCampuses(campuses));
        } catch (err) {
            console.error(err);
        }
    };
};

export const fetchCampusDetail = (id) => {
    // Fetches campuses from my api
    return async (dispatch) => {
        try {
            const campus = (await axios.get(`/api/campuses/${id}`)).data;

            // Dispatches the action to all reducers
            dispatch(loadCampusDetail(campus));
        } catch (err) {
            console.error(err);
        }
    };
};

export const addCampusToDatabase = (campusData) => {
    return async (dispatch) => {
        try {
            // Attempts to add the campus to the database, then grabs all campuses in database
            const { data: newCampus } = await axios.post(
                `/api/campuses`,
                campusData,
            );

            // Dispatches the add campus event
            dispatch(addCampus(newCampus));
        } catch (err) {
            console.error(err);
        }
    };
};

export const deleteCampusFromDatabase = (id) => {
    return async (dispatch) => {
        try {
            // Attempts to delete the campus from the database, then grabs all campuses in database
            await axios.delete(`/api/campuses/${id}`);

            // Dispatches the delete campus event
            dispatch(deleteCampus(id));
        } catch (err) {
            console.error(err);
        }
    };
};

export const updateCampusInDatabase = (payload) => {
    return async (dispatch) => {
        try {
            // Attempts to update the student in the database, then grabs that student
            const { data: campus } = await axios.put(
                `/api/campuses/${payload.id}`,
                payload,
            );

            // Dispatches the action to all reducers
            dispatch(updateCampus(campus));
        } catch (err) {
            console.error(err);
        }
    };
};

// Initial Reducer State
const initialState = {
    allCampuses: [],
    displayedCampuses: [],
    selectedCampus: {},
};

// Campuses Reducer
export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_All_CAMPUSES:
            return (state = {
                ...state,
                displayedCampuses: action.campuses,
                allCampuses: action.campuses,
            });

        case LOAD_CAMPUS_DETAIL:
            return (state = {
                ...state,
                selectedCampus: action.campus,
            });

        case ADD_CAMPUS: {
            const newCampus = Object.assign(action.campus, {
                studentCount: 0,
            });

            return (state = {
                ...state,
                displayedCampuses: [...state.displayedCampuses, newCampus],
                allCampuses: [...state.allCampuses, newCampus],
                selectedCampus: newCampus,
            });
        }

        case DELETE_CAMPUS: {
            const newAllCampuses = state.allCampuses.filter(
                (campus) => campus.id !== action.campusId,
            );

            const newDisplayedCampuses = state.displayedCampuses.filter(
                (campus) => campus.id !== action.campusId,
            );

            const newSelectedCampus =
                state.selectedCampus.id === action.campusId
                    ? {}
                    : state.selectedCampus;

            return (state = {
                ...state,
                displayedCampuses: [...newDisplayedCampuses],
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

        case SEARCH_CAMPUS_LISTING: {
            const newDisplayedCampuses = state.allCampuses.filter((campus) => {
                if (
                    campus.name
                        .toLowerCase()
                        .includes(action.str.toLowerCase().trim())
                ) {
                    return campus;
                }
            });
            return (state = {
                ...state,
                displayedCampuses: newDisplayedCampuses,
            });
        }

        case SORT_CAMPUSES: {
            const compare = (a, b) => {
                // If null value, treat it as less than 0
                if (!a[action.str]) {
                    a[action.str] = -1;
                } else if (!a[action.str]) {
                    b[action.str] = -1;
                }

                // We have to compare consistent types to each other
                const valueA =
                    typeof a[action.str] === "string"
                        ? a[action.str].toLowerCase()
                        : a[action.str];
                const valueB =
                    typeof b[action.str] === "string"
                        ? b[action.str].toLowerCase()
                        : b[action.str];

                // If ascending
                if (action.order) {
                    if (valueA < valueB) {
                        return -1;
                    }
                    if (valueA > valueB) {
                        return 1;
                    }
                } else {
                    if (valueA < valueB) {
                        return 1;
                    }
                    if (valueA > valueB) {
                        return -1;
                    }
                }

                // If equal values, return 0
                return 0;
            };

            // Action.order === true for ascending
            const newDisplayedCampuses = [...state.displayedCampuses].sort(
                compare,
            );

            return (state = {
                ...state,
                displayedCampuses: newDisplayedCampuses,
            });
        }

        case FILTER_CAMPUSES: {
            // If active, filter, if not, display all students
            const newDisplayedCampuses = action.active
                ? state.displayedCampuses.filter((campus) => {
                      switch (action.str) {
                          case "noStudents":
                              return campus.studentCount === "0";
                      }
                  })
                : state.allCampuses;

            return (state = {
                ...state,
                displayedCampuses: newDisplayedCampuses,
            });
        }

        default:
            return state;
    }
};
