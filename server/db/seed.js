const db = require("./db");
const Student = require("./model/Student");
const Campus = require("./model/Campus");
const faker = require("faker");
const axios = require("axios");

// TAKES A WHILE! ~1 minute-ish
const seed = async () => {
    try {
        // Produces a random number of these in the database
        const NUMBER_OF_UNIVERSITIES = 25;
        const NUMBER_OF_STUDENTS = 200;

        // Drop database if exists...
        await db.sync({ force: true });

        // Generates fake universities
        let fakeUniversities = [];
        for (let i = 1; i <= NUMBER_OF_UNIVERSITIES; i++) {
            const randomNum = Math.floor(Math.random() * 1000);
            const name = (
                await axios.get(
                    "http://universities.hipolabs.com/search?country=united%20states",
                )
            ).data[randomNum].name;

            const num = Math.floor(Math.random() * 4) + 1;
            const description = (
                await axios.get(
                    `https://baconipsum.com/api/?type=all-meat&sentences=${num}&start-with-lorem=1&format=html`,
                )
            ).data;

            const imgUrl = (await axios.get("https://picsum.photos/200"))
                .request.connection._httpMessage.res.responseUrl;

            const street = faker.address.streetAddress();
            const city = faker.address.city();
            const state = faker.address.state();
            const zip = faker.address.zipCode();
            const address = `${street}, ${city}, ${state} ${zip}`;

            fakeUniversities.push({
                name: name,
                address: address,
                state: state,
                description: description,
                imgUrl: imgUrl,
            });

            console.log(`${i} universities generated`);
        }

        await Promise.all(
            fakeUniversities.map((campus) => {
                Campus.create({
                    name: campus.name,
                    address: campus.address,
                    state: campus.state,
                    description: campus.description,
                    imgUrl: campus.imgUrl,
                });
            }),
        );

        // Generates fake students
        let fakeStudents = [];
        for (let i = 1; i <= NUMBER_OF_STUDENTS; i++) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const email = faker.internet.email();
            const gpa = faker.random.number({ min: 0, max: 4, precision: 0.1 });
            const imgUrl = (await axios.get("https://randomuser.me/api/")).data
                .results[0].picture.large;

            const numOfColleges = (await Campus.findAll()).length;
            let cId = Math.floor(Math.random() * numOfColleges);
            if (cId !== 0) {
                fakeStudents.push({
                    first: firstName,
                    last: lastName,
                    email: email,
                    gpa: gpa,
                    imgUrl: imgUrl,
                    cId: cId,
                });
            } else {
                fakeStudents.push({
                    first: firstName,
                    last: lastName,
                    email: email,
                    gpa: gpa,
                    imgUrl: imgUrl,
                });
            }

            console.log(`${i} students generated`);
        }

        await Promise.all(
            fakeStudents.map((stu) => {
                const { first, last, email, gpa, cId, imgUrl } = stu;

                Student.create({
                    firstName: first,
                    lastName: last,
                    email: email,
                    gpa: gpa,
                    CampusId: cId,
                    imgUrl: imgUrl,
                });
            }),
        );

        console.log("Database Synced and Seeded!");
    } catch (err) {
        console.error(err);
    }
};

// Seeds database with original data (only if there are no students!!!)
const seedOnce = async () => {
    const students = await Student.findAll();
    if (!students.length) {
        await seed();
    }
};

module.exports = { seedOnce };
