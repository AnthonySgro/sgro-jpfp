const { expect } = require("chai");

// Import the app to run it
const app = require("../server");

// Axios functions
const {
    getStudent,
    getAllStudents,
    makeStudent,
    updateStudent,
    deleteStudent,
    getCampus,
    getAllCampuses,
    makeCampus,
    updateCampus,
    deleteCampus,
} = require("./server");

// DB Models
const {
    db,
    model: { Campus, Student },
} = require("../server/db/");

// Tests all server routes
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

        describe("POST /api/students", () => {
            it("Creates a student in the database", () => {
                return makeStudent().then(async (response) => {
                    const student = await Student.findOne({
                        where: {
                            firstName: "TestNameFirst",
                        },
                    });

                    // Expect an object back
                    expect(typeof response).to.equal("object");

                    // Expect the data to match our direct database query
                    expect(response.firstName).to.equal(student.firstName);
                    expect(response.lastName).to.equal(student.lastName);
                    expect(response.email).to.equal(student.email);
                });
            });

            afterEach(async () => {
                await Student.destroy({
                    where: {
                        firstName: "TestNameFirst",
                    },
                });
            });
        });

        describe("PUT /api/students/:id", () => {
            it("Updates a student in the database", () => {
                return updateStudent().then(async (response) => {
                    const student = await Student.findOne({
                        where: {
                            firstName: "TestNameFirstCHANGED",
                        },
                    });

                    const oldStudent = await Student.findOne({
                        where: {
                            firstName: "TestNameFirst",
                        },
                    });

                    // Expect an object back
                    expect(typeof response).to.equal("object");

                    // Expect the data to match our direct database query
                    expect(response.firstName).to.equal(student.firstName);
                    expect(response.lastName).to.equal(student.lastName);
                    expect(response.email).to.equal(student.email);
                });
            });

            afterEach(async () => {
                await Student.destroy({
                    where: {
                        firstName: "TestNameFirstCHANGED",
                    },
                });
            });
        });

        describe("DELETE /api/students/:id", () => {
            it("Deletes a student in the database", () => {
                return deleteStudent().then(async (response) => {
                    // Expect an object back
                    expect(typeof response).to.equal("number");
                    // Expect a 204 response
                    expect(response).to.equal(204);
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

        describe("POST /api/campuses", () => {
            it("Creates a campus in the database", () => {
                return makeCampus().then(async (response) => {
                    const campus = await Campus.findOne({
                        where: {
                            name: "TestCampus",
                        },
                    });

                    // Expect an object back
                    expect(typeof response).to.equal("object");

                    // Expect the data to match our direct database query
                    expect(response.name).to.equal(campus.name);
                    expect(response.description).to.equal(campus.description);
                    expect(response.address).to.equal(campus.address);
                });
            });

            afterEach(async () => {
                await Campus.destroy({
                    where: {
                        name: "TestCampus",
                    },
                });
            });
        });

        describe("PUT /api/campuses/:id", () => {
            it("Updates a campus in the database", () => {
                return updateCampus().then(async (response) => {
                    const campus = await Campus.findOne({
                        where: {
                            name: "TestCampusCHANGED",
                        },
                    });

                    // Expect an object back
                    expect(typeof response).to.equal("object");

                    // Expect the data to match our direct database query
                    expect(response.name).to.equal(campus.name);
                    expect(response.description).to.equal(campus.description);
                    expect(response.address).to.equal(campus.address);
                });
            });

            afterEach(async () => {
                await Campus.destroy({
                    where: {
                        name: "TestCampusCHANGED",
                    },
                });
            });
        });

        describe("DELETE /api/campuses/:id", () => {
            it("Deletes a student in the database", () => {
                return deleteCampus().then(async (response) => {
                    // Expect an object back
                    expect(typeof response).to.equal("number");
                    // Expect a 204 response
                    expect(response).to.equal(204);
                });
            });
        });
    });
});
