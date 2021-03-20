import axios from "axios";

// Action Type
const LOAD_All_STUDENTS = "LOAD_All_STUDENTS";

// Action Creator
export const loadAllStudents = (allStudents) => {
    return {
        type: LOAD_All_STUDENTS,
        allStudents,
    };
};

// Thunk
export const fetchAllStudents = () => {
    // Fetches campuses from my api
    return async (dispatch) => {
        const students = (await axios.get("/api/students")).data;

        // Dispatches the action to all reducers
        dispatch(loadAllStudents(students));
    };
};

// Initial Reducer State
const initialState = { allStudents: [], selectedStudent: {} };

// Campuses Reducer
export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_All_STUDENTS:
            return (state = { ...state, allStudents: action.allStudents });
        default:
            return state;
    }
};
