const db = require("./db");
const { seed, seedOnce } = require("./seed");
const Student = require("./model/Student");
const Campus = require("./model/Campus");

module.exports = {
    db,
    seedOnce,
    seed,
    model: {
        Student,
        Campus,
    },
};
