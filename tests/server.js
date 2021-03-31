const axios = require("axios");
const {
    model: { Campus, Student },
} = require("../server/db/");

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

    makeStudent() {
        return axios
            .post(`http://localhost:5005/api/students/`, {
                firstName: "TestNameFirst",
                lastName: "TestNameLast",
                email: "email@gmail.com",
                imgUrl:
                    "https://upload.wikimedia.org/wikipedia/commons/8/8e/Chi-square_distributionCDF-English.png",
            })
            .then((res) => res.data)
            .catch((error) => console.log(error));
    },

    async updateStudent() {
        const { data: student } = await axios.post(
            `http://localhost:5005/api/students/`,
            {
                firstName: "TestNameFirst",
                lastName: "TestNameLast",
                email: "email@gmail.com",
                imgUrl:
                    "https://upload.wikimedia.org/wikipedia/commons/8/8e/Chi-square_distributionCDF-English.png",
            },
        );

        return axios
            .put(`http://localhost:5005/api/students/${student.id}`, {
                firstName: "TestNameFirstCHANGED",
                lastName: "TestNameLastCHANGED",
                email: "emailCHANGED@gmail.com",
                imgUrl:
                    "https://upload.wikimedia.org/wikipedia/commons/8/8e/Chi-square_distributionCDF-English.png",
            })
            .then((res) => res.data)
            .catch((error) => console.log(error));
    },

    async deleteStudent() {
        const { data: student } = await axios.post(
            `http://localhost:5005/api/students/`,
            {
                firstName: "TestNameFirst",
                lastName: "TestNameLast",
                email: "email@gmail.com",
                imgUrl:
                    "https://upload.wikimedia.org/wikipedia/commons/8/8e/Chi-square_distributionCDF-English.png",
            },
        );

        return axios
            .delete(`http://localhost:5005/api/students/${student.id}`)
            .then((res) => res.status)
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

    makeCampus() {
        return axios
            .post(`http://localhost:5005/api/campuses/`, {
                name: "TestCampus",
                address: "TestAddress",
                description: "TestDescription",
            })
            .then((res) => res.data)
            .catch((error) => console.log(error));
    },

    async deleteCampus() {
        const { data: campus } = await axios.post(
            `http://localhost:5005/api/campuses/`,
            {
                name: "TestCampus",
                address: "TestAddress",
                description: "TestDescription",
            },
        );

        return axios
            .delete(`http://localhost:5005/api/campuses/${campus.id}`)
            .then((res) => res.status)
            .catch((error) => console.log(error));
    },

    async updateCampus() {
        const { data: campus } = await axios.post(
            `http://localhost:5005/api/campuses/`,
            {
                name: "TestCampus",
                address: "TestAddress",
                description: "TestDescription",
            },
        );

        return axios
            .put(`http://localhost:5005/api/campuses/${campus.id}`, {
                name: "TestCampusCHANGED",
                address: "TestAddressCHANGED",
                description: "TestDescriptionCHANGED",
            })
            .then((res) => res.data)
            .catch((error) => console.log(error));
    },
};
