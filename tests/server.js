const axios = require("axios");

module.exports = {
    getStudent(id) {
        return axios
            .get(`http://localhost:5005/api/students/${id}`)
            .then((res) => res.data)
            .catch((error) => console.log(error));
    },

    getAllStudents() {
        return axios
            .get(`http://localhost:5005/api/students/`)
            .then((res) => res.data)
            .catch((error) => console.log(error));
    },

    getCampus(id) {
        return axios
            .get(`http://localhost:5005/api/campuses/${id}`)
            .then((res) => res.data)
            .catch((error) => console.log(error));
    },

    getAllCampuses() {
        return axios
            .get(`http://localhost:5005/api/campuses/`)
            .then((res) => res.data)
            .catch((error) => console.log(error));
    },
};
