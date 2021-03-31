// DB Models
const {
    db,
    model: { Campus, Student },
} = require("../server/db/");

module.exports = {
    CampusNotEmptyNameTest() {
        return Campus.create({
            name: "",
            address: "fake address",
            state: "fake state",
            description: "fake description",
        })
            .then((res) => res.data)
            .catch((error) => error);
    },
    CampusNotNullNameTest() {
        return Campus.create({
            address: "fake address",
            state: "fake state",
            description: "fake description",
        })
            .then((res) => res.data)
            .catch((error) => error);
    },
    CampusNotEmptyAddressTest() {
        return Campus.create({
            name: "Harvard",
            address: "",
            state: "fake state",
            description: "fake description",
        })
            .then((res) => res.data)
            .catch((error) => error);
    },
    CampusNotNullAddressTest() {
        return Campus.create({
            name: "Harvard",
            state: "fake state",
            description: "fake description",
        })
            .then((res) => res.data)
            .catch((error) => error);
    },
    StudentEmailTest(email) {
        return Student.create({
            firstName: "Tom",
            lastName: "Robbins",
            email: email,
        })
            .then((res) => res.data)
            .catch((error) => error);
    },
};
