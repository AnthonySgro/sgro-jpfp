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

const SEARCH_STUDENT_LISTING = "SEARCH_STUDENT_LISTING";
const SORT_STUDENTS = "SORT_STUDENTS";
const FILTER_STUDENTS = "FILTER_STUDENTS";

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

export const searchStudentListing = (str) => {
    return {
        type: SEARCH_STUDENT_LISTING,
        str,
    };
};

export const sortStudentListing = (str, order) => {
    return {
        type: SORT_STUDENTS,
        str,
        order,
    };
};

export const filterStudentListing = (str, active) => {
    return {
        type: FILTER_STUDENTS,
        str,
        active,
    };
};

// Thunks
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
const initialState = {
    allStudents: [],
    displayedStudents: [],
    currentSort: "",
    selectedStudent: {},
};

// Student Reducer
export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_All_STUDENTS:
            return (state = {
                ...state,
                currentSort: "",
                displayedStudents: action.allStudents,
                allStudents: action.allStudents,
            });

        case LOAD_STUDENT_DETAIL:
            return (state = {
                ...state,
                selectedStudent: action.student,
            });

        case ADD_STUDENT:
            return (state = {
                ...state,
                allStudents: [...state.allStudents, action.newStudent],
                displayedStudents: [
                    ...state.displayedStudents,
                    action.newStudent,
                ],
                selectedStudent: action.newStudent,
            });

        case DELETE_STUDENT: {
            const newAllStudents = state.allStudents.filter(
                (student) => student.id !== action.studentId,
            );

            const newDisplayedStudents = state.displayedStudents.filter(
                (student) => student.id !== action.studentId,
            );

            const newSelectedStudent =
                state.selectedStudent.id === action.studentId
                    ? {}
                    : state.selectedStudent;

            return (state = {
                ...state,
                allStudents: [...newAllStudents],
                displayedStudents: [...newDisplayedStudents],
                selectedStudent: newSelectedStudent,
            });
        }

        case UPDATE_STUDENT: {
            const newAllStudents = state.allStudents.filter(
                (student) => student.id !== action.student.id,
            );

            return (state = {
                ...state,
                displayedStudents: state.allStudents,
                allStudents: [...newAllStudents, action.student],
                selectedStudent: action.student,
            });
        }

        case UPDATE_REGISTRATION: {
            const newAllStudents = state.allStudents.filter(
                (student) => student.id !== action.student.id,
            );

            return (state = {
                ...state,
                displayedStudents: state.allStudents,
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
                ...state,
                displayedStudents: [...newAllStudents],
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
                ...state,
                displayedStudents: [...newAllStudents],
                allStudents: [...newAllStudents],
                selectedStudent: newSelectedStudent,
            });
        }

        case SEARCH_STUDENT_LISTING: {
            const newDisplayedStudents = state.allStudents.filter((student) => {
                const fullName = (
                    student.firstName +
                    " " +
                    student.lastName
                ).toLowerCase();
                if (fullName.includes(action.str.toLowerCase().trim())) {
                    return student;
                }
            });
            return (state = {
                ...state,
                displayedStudents: newDisplayedStudents,
            });
        }

        case SORT_STUDENTS: {
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
            const newDisplayedStudents = [...state.displayedStudents].sort(
                compare,
            );

            return (state = {
                ...state,
                displayedStudents: newDisplayedStudents,
            });
        }

        case FILTER_STUDENTS: {
            // If active, filter, if not, display all students
            const newDisplayedStudents = action.active
                ? state.displayedStudents.filter((student) => {
                      switch (action.str) {
                          case "notEnrolled":
                              return student.CampusId === null;
                      }
                  })
                : state.allStudents;

            return (state = {
                ...state,
                displayedStudents: newDisplayedStudents,
            });
        }

        default:
            return state;
    }
};
