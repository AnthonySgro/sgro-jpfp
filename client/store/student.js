import axios from "axios";

// Action Type
const LOAD_All_STUDENTS = "LOAD_All_STUDENTS";
const LOAD_STUDENT_DETAIL = "LOAD_STUDENT_DETAIL";
const ADD_STUDENT = "ADD_STUDENT";

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
        (await axios.post("/api/students", studentData)).data;
        const students = (await axios.get("/api/students")).data;
        dispatch(addStudent(students));
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
        default:
            return state;
    }
};
