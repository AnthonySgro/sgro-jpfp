import axios from "axios";

// Import redux actions
import { fetchAllCampuses, fetchCampusDetail } from "./campus";

// Action Type
const LOAD_All_STUDENTS = "LOAD_All_STUDENTS";
const LOAD_STUDENT_DETAIL = "LOAD_STUDENT_DETAIL";
const ADD_STUDENT = "ADD_STUDENT";
const DELETE_STUDENT = "DELETE_STUDENT";
const UPDATE_STUDENT = "UPDATE_STUDENT";
const UPDATE_REGISTRATION = "UPDATE_REGISTRATION";

const DELETE_CAMPUS = "DELETE_CAMPUS";
const UPDATE_CAMPUS = "UPDATE_CAMPUS";

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

export const addStudent = (newStudent) => {
    return {
        type: ADD_STUDENT,
        newStudent,
    };
};

export const deleteStudent = (id, campus) => {
    return {
        type: DELETE_STUDENT,
        studentId: id,
        studentCampus: campus,
    };
};

export const updateStudent = (student) => {
    return {
        type: UPDATE_STUDENT,
        student,
    };
};

export const updateRegistration = (newStudent, newCampusId, oldCampusId) => {
    return {
        type: UPDATE_REGISTRATION,
        student: newStudent,
        newCampusId,
        oldCampusId,
    };
};

// Thunk
export const fetchAllStudents = () => {
    return async (dispatch) => {
        try {
            const students = (await axios.get("/api/students")).data;

            // Dispatches the action to all reducers
            dispatch(loadAllStudents(students));
        } catch (err) {
            console.error(err);
        }
    };
};

export const fetchStudentDetail = (id) => {
    return async (dispatch) => {
        try {
            const student = (await axios.get(`/api/students/${id}`)).data;

            // Dispatches the action to all reducers
            dispatch(loadStudentDetail(student));
        } catch (err) {
            console.error(err);
        }
    };
};

export const addStudentToDatabase = (studentData) => {
    return async (dispatch) => {
        try {
            // Attempts to add the student to the database, then grabs all students in database
            const { data: newStudent } = await axios.post(
                "/api/students",
                studentData,
            );

            // Dispatches the action to all reducers
            dispatch(addStudent(newStudent));
        } catch (err) {
            console.error(err);
        }
    };
};

export const deleteStudentFromDatabase = (studentInfo) => {
    return async (dispatch) => {
        try {
            // We only need to know the id of the student and their campus
            const { id, campus } = studentInfo;

            // Attempts to delete the student from the database, then grabs all students in database
            await axios.delete(`/api/students/${studentInfo.id}`);

            // Dispatches the action to all reducers
            dispatch(deleteStudent(id, campus));
        } catch (err) {
            console.error(err);
        }
    };
};

export const updateStudentInDatabase = (payload) => {
    return async (dispatch) => {
        try {
            // Attempts to update the student in the database, then grabs that student
            const { data: newStudent } = await axios.put(
                `/api/students/${payload.id}`,
                payload,
            );

            // Dispatches the action to all reducers
            dispatch(updateStudent(newStudent));
        } catch (err) {
            console.error(err);
        }
    };
};

export const changeStudentCampusInDatabase = (payload) => {
    return async (dispatch) => {
        try {
            // Attempts to change the students registration in the database
            const { data: newStudent } = await axios.put(
                `/api/students/${payload.id}`,
                payload,
            );

            dispatch(
                updateRegistration(
                    newStudent,
                    payload.newCampusId,
                    payload.prevCampusId,
                ),
            );
        } catch (err) {
            console.error(err);
        }
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
            return (state = {
                ...state,
                allStudents: [...state.allStudents, action.newStudent],
                selectedStudent: action.newStudent,
            });
        case DELETE_STUDENT: {
            const newAllStudents = state.allStudents.filter(
                (student) => student.id !== action.studentId,
            );

            const newSelectedStudent =
                state.selectedStudent.id === action.studentId
                    ? {}
                    : state.selectedStudent;

            return (state = {
                allStudents: [...newAllStudents],
                selectedStudent: newSelectedStudent,
            });
        }
        case UPDATE_STUDENT: {
            const newAllStudents = state.allStudents.filter(
                (student) => student.id !== action.student.id,
            );

            return (state = {
                allStudents: [...newAllStudents, action.student],
                selectedStudent: action.student,
            });
        }
        case UPDATE_REGISTRATION: {
            const newAllStudents = state.allStudents.filter(
                (student) => student.id !== action.student.id,
            );

            return (state = {
                allStudents: [...newAllStudents, action.student],
                selectedStudent: action.student,
            });
        }
        case DELETE_CAMPUS: {
            const newAllStudents = state.allStudents.reduce((acc, cur) => {
                if (cur.CampusId === action.campusId) {
                    cur = { ...cur, Campus: null, CampusId: null };
                }
                acc.push(cur);
                return acc;
            }, []);

            const newSelectedStudent =
                state.selectedStudent.CampusId === action.campusId
                    ? { ...state.selectedStudent, Campus: null, CampusId: null }
                    : state.selectedStudent;

            return (state = {
                allStudents: [...newAllStudents],
                selectedStudent: newSelectedStudent,
            });
        }
        case UPDATE_CAMPUS: {
            const newAllStudents = state.allStudents.reduce((acc, cur) => {
                if (cur.CampusId === action.campus.id) {
                    cur = {
                        ...cur,
                        Campus: action.campus,
                        CampusId: action.campus.id,
                    };
                }
                acc.push(cur);
                return acc;
            }, []);

            const newSelectedStudent =
                state.selectedStudent.CampusId === action.campus.id
                    ? { ...state.selectedStudent, Campus: action.campus }
                    : state.selectedStudent;

            return (state = {
                allStudents: [...newAllStudents],
                selectedStudent: newSelectedStudent,
            });
        }
        default:
            return state;
    }
};
