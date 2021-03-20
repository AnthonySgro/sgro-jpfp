const db = require("./db");
const Student = require("./model/Student");
const Campus = require("./model/Campus");

const seed = async () => {
    try {
        await db.sync({ force: true });
        console.log("Database Synced!");

        await Promise.all(
            [
                {
                    name: "Ohio State University",
                    description: "THE Osu lorem ipsum dolor stuff yada yada",
                },
                {
                    name: "Penn State University",
                    description:
                        "Arch nemesis perhaps? I don't know you be the judge",
                },
                {
                    name: "The University of Michigan",
                    description: "garbage football team more yada yada oh man",
                },
            ].map((campus) => {
                const { name, description } = campus;
                Campus.create({
                    name: campus.name,
                    description: campus.description,
                });
            }),
        );
        const pennState = Campus.findByName("Penn State University");

        await Promise.all(
            [
                {
                    first: "Anthony",
                    last: "Sgro",
                    email: "fakeEmail1776@gmail.com",
                    gpa: 2.0,
                    cId: 1,
                },
                {
                    first: "Tom",
                    last: "Robbins",
                    email: "fakeEmail1777@gmail.com",
                    gpa: 2.3,
                    cId: 2,
                },
                {
                    first: "Nava",
                    last: "Vaikunthan",
                    email: "fakeEmail2008@gmail.com",
                    gpa: 3.5,
                    cId: 2,
                },
                {
                    first: "Tamanna",
                    last: "Ananna",
                    email: "anotherFakeEmail2@gmail.com",
                    gpa: 3.8,
                    cId: 2,
                },
            ].map((stu) => {
                const { first, last, email, gpa, cId } = stu;

                Student.create({
                    firstName: first,
                    lastName: last,
                    email: email,
                    gpa: gpa,
                    CampusId: cId,
                });
            }),
        );
    } catch (err) {
        console.log(err);
    }
};

module.exports = seed;
