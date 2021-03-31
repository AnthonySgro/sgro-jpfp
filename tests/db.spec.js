const { expect } = require("chai");

// Import the app to run it
const app = require("../server");

// Testing functions
const {
    CampusNotEmptyNameTest,
    CampusNotNullNameTest,
    CampusNotEmptyAddressTest,
    CampusNotNullAddressTest,
    StudentEmailTest,
} = require("./db");

// DB Models
const {
    db,
    model: { Campus, Student },
} = require("../server/db/");

describe("Database", () => {
    describe("Campus Model", () => {
        describe("Student Model", () => {
            describe("Student Validation", () => {
                it("Email must be valid email", () => {
                    return StudentEmailTest("tomrobbinsgmail.com").then(
                        async (response) => {
                            // Expect validation error
                            expect(response.message).to.equal(
                                "Validation error: Validation isEmail on email failed",
                            );
                        },
                    );
                });
            });
        });

        describe("Campus Validation", () => {
            it("Name cannot be empty", () => {
                return CampusNotEmptyNameTest().then(async (response) => {
                    // Expect validation error
                    expect(response.message).to.equal(
                        "Validation error: Validation notEmpty on name failed",
                    );
                });
            });
            it("Name cannot be null", () => {
                return CampusNotNullNameTest().then(async (response) => {
                    // Expect notNull Violation
                    expect(response.message).to.equal(
                        "notNull Violation: Campuses.name cannot be null",
                    );
                });
            });
            it("Address cannot be empty", () => {
                return CampusNotEmptyAddressTest().then(async (response) => {
                    // Expect validation error
                    expect(response.message).to.equal(
                        "Validation error: Validation notEmpty on address failed",
                    );
                });
            });
            it("Address cannot be null", () => {
                return CampusNotNullAddressTest().then(async (response) => {
                    // Expect notNull Violation
                    expect(response.message).to.equal(
                        "notNull Violation: Campuses.address cannot be null",
                    );
                });
            });
        });
    });
});
