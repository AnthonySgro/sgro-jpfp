const { expect } = require("chai");

// Import the app to run it
const app = require("../server");

// Axios functions
const {
    getStudent,
    getAllStudents,
    getCampus,
    getAllCampuses,
} = require("./server");

// DB Models
const {
    db,
    model: { Campus, Student },
} = require("../server/db/");

describe("Server", () => {
    describe("Student API", () => {
        describe("GET /api/students", () => {
            let students;
            beforeEach(async () => {
                students = await Student.findAll({
                    raw: true,
                });
            });
            it("Gets all students", () => {
                return getAllStudents().then(async (response) => {
                    // Expect an object back
                    expect(typeof response).to.equal("object");

                    // Make sure the lengths are the same
                    expect(response.length).to.equal(students.length);
                });
            });
        });

        describe("GET /api/students/:id", () => {
            let student;
            beforeEach(async () => {
                student = await Student.findOne({
                    where: {
                        id: 1,
                    },
                });
            });

            it("Gets a student by id", () => {
                return getStudent(1).then(async (response) => {
                    // Expect an object back
                    expect(typeof response).to.equal("object");

                    //Test result of name, gpa and associated campus for the response
                    expect(response.firstName).to.equal(student.firstName);
                    expect(response.gpa).to.equal(student.gpa);
                    expect(response.CampusId).to.equal(student.CampusId);
                });
            });
        });
    });

    describe("Campus API", () => {
        describe("GET /api/campuses", () => {
            let campuses;
            beforeEach(async () => {
                campuses = await Campus.findAll({
                    raw: true,
                });
            });
            it("Gets all campuses", () => {
                return getAllCampuses().then(async (response) => {
                    // Expect an object back
                    expect(typeof response).to.equal("object");

                    // Make sure the lengths are the same
                    expect(response.length).to.equal(campuses.length);
                });
            });
        });

        describe("GET /api/students/:id", () => {
            let campus;
            beforeEach(async () => {
                campus = await Campus.findOne({
                    where: {
                        id: 1,
                    },
                });
            });

            it("Gets a student by id", () => {
                return getCampus(1).then(async (response) => {
                    // Expect an object back
                    expect(typeof response).to.equal("object");

                    //Test result of name, description and address for the response
                    expect(response.name).to.equal(campus.name);
                    expect(response.description).to.equal(campus.description);
                    expect(response.address).to.equal(campus.address);
                });
            });
        });
    });
});
