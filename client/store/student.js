import axios from "axios";

// Import redux actions
import { fetchAllCampuses, fetchCampusDetail } from "./campus";

// Action Type
const LOAD_All_STUDENTS = "LOAD_All_STUDENTS";
const LOAD_STUDENT_DETAIL = "LOAD_STUDENT_DETAIL";
const ADD_STUDENT = "ADD_STUDENT";
const DELETE_STUDENT = "DELETE_STUDENT";
const UPDATE_STUDENT = "UPDATE_STUDENT";

// Action Creator
export const loadAllStudents = (allStudents) => {
    return {
        type: LOAD_All_STUDENTS,
        allStudents,
    };
};

export const loadStudentDetail = (student) => {
    return {
        type: LOAD_STUDENT_DETAIL,
        student,
    };
};

export const addStudent = (allStudents) => {
    return {
        type: ADD_STUDENT,
        allStudents,
    };
};

export const deleteStudent = (allStudents) => {
    return {
        type: DELETE_STUDENT,
        allStudents,
    };
};

export const updateStudent = (student) => {
    return {
        type: UPDATE_STUDENT,
        student,
    };
};

// Thunk
export const fetchAllStudents = () => {
    // Fetches students from my api
    return async (dispatch) => {
        const students = (await axios.get("/api/students")).data;

        // Dispatches the action to all reducers
        dispatch(loadAllStudents(students));
    };
};

export const fetchStudentDetail = (id) => {
    // Fetches students from my api
    return async (dispatch) => {
        const student = (await axios.get(`/api/students/${id}`)).data;

        // Dispatches the action to all reducers
        dispatch(loadStudentDetail(student));
    };
};

export const addStudentToDatabase = (studentData) => {
    return async (dispatch) => {
        // Attempts to add the student to the database, then grabs all students in database
        await axios.post("/api/students", studentData);
        const students = (await axios.get("/api/students")).data;

        // Dispatches the action to all reducers
        dispatch(addStudent(students));

        // Re-fetches campuses as the addition may have changed things
        dispatch(fetchAllCampuses());
    };
};

export const deleteStudentFromDatabase = (studentId, campusId) => {
    return async (dispatch) => {
        // Attempts to delete the student from the database, then grabs all students in database
        await axios.delete(`/api/students/${studentId}`);
        const students = (await axios.get("/api/students")).data;

        // Dispatches the action to all reducers
        dispatch(deleteStudent(students));

        // Re-fetches campuses as the delete may have changed things
        dispatch(fetchAllCampuses());

        if (campusId) {
            // Re-fetches target campus in case we are deleting from its detail page
            dispatch(fetchCampusDetail(campusId));
        }
    };
};

export const updateStudentInDatabase = (payload, campusId) => {
    return async (dispatch) => {
        // Attempts to update the student in the database, then grabs that student
        await axios.put(`/api/students/${payload.id}`, payload);
        const student = (await axios.get(`/api/students/${payload.id}`)).data;

        // Dispatches the action to all reducers
        dispatch(updateStudent(student));
    };
};

// Initial Reducer State
const initialState = { allStudents: [], selectedStudent: {} };

// Student Reducer
export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_All_STUDENTS:
            return (state = { ...state, allStudents: action.allStudents });
        case LOAD_STUDENT_DETAIL:
            return (state = { ...state, selectedStudent: action.student });
        case ADD_STUDENT:
            return (state = { ...state, allStudents: action.allStudents });
        case DELETE_STUDENT:
            return (state = { ...state, allStudents: action.allStudents });
        case UPDATE_STUDENT:
            return (state = { ...state, selectedStudent: action.student });

        default:
            return state;
    }
};
