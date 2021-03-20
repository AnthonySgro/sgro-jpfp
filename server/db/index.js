const db = require("./db");
const seed = require("./seed");
const Student = require("./model/Student");
const Campus = require("./model/Campus");

module.exports = {
    db,
    seed,
    model: {
        Student,
        Campus,
    },
};
