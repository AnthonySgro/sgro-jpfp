const db = require("./db");
const seedOnce = require("./seed");
const Student = require("./model/Student");
const Campus = require("./model/Campus");

module.exports = {
    db,
    seedOnce,
    model: {
        Student,
        Campus,
    },
};
