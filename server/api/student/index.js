const express = require("express");
const router = express.Router();

// Database imports
const {
    db,
    model: { Campus, Student },
} = require("../../db");

router.get("/", async (req, res, next) => {
    try {
        const { page } = req.query;
        if (!page) {
            // Get all campuses
            const allStudents = await Student.findAll({
                include: {
                    model: Campus,
                },
                order: [["id", "ASC"]],
            });

            // Return proper status
            res.status(200).send(allStudents);
        } else {
            // Catch invalid page request
            if (page < 1) {
                res.sendStatus(400);
            }

            // Returns a paginated list based on the page we input
            const paginatedStudents = await Student.findAndCountAll({
                include: {
                    model: Campus,
                    required: false,
                },
                order: [["id", "ASC"]],
                limit: 10,
                offset: 10 * parseInt(page) - 10,
            });

            // Return proper status
            res.status(200).send(paginatedStudents);
        }
    } catch (err) {
        next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { firstName, lastName, email, campusName } = req.body;
        let { imgUrl } = req.body;
        // Set a default value for the associated campus
        let associatedCampusId = null;

        // If user sent a campus name, change associated campus
        if (!!campusName) {
            associatedCampusId = (
                await Campus.findOne({
                    where: {
                        name: campusName,
                    },
                })
            ).id;
        }

        // If user sent empty URL, allow it and use default pic
        if (imgUrl === "") {
            imgUrl =
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
        }

        const newStudent = await Student.create({
            firstName,
            lastName,
            email,
            CampusId: associatedCampusId,
            imgUrl,
        });

        if (newStudent !== null) {
            res.status(201).send(newStudent);
        }
    } catch (err) {
        switch (err.errors[0].type) {
            case "Validation error":
                res.sendStatus(422);
            case "unique violation":
                res.sendStatus(409);
            default:
                console.log(err);
                next(err);
        }
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        // Default parameter passed
        const { id } = req.params;

        // For student info update
        const { firstName, lastName } = req.body;
        let { gpa, email } = req.body;

        // For campus update
        const { newCampusId } = req.body;

        // Finds student
        let student = await Student.findOne({
            where: {
                id,
            },
            include: {
                model: Campus,
            },
        });

        // If student not found, return 404
        if (student === null) {
            res.sendStatus(404);
        }

        // Two kinds of updates: student data ** or ** associated campus
        if (firstName) {
            if (gpa === "N/A" || gpa === "") {
                gpa = null;
            }

            // Update values
            student.firstName = firstName;
            student.lastName = lastName;
            student.email = email;
            student.gpa = gpa || 0;
        } else {
            if (!newCampusId) {
                campusId = null;
            }

            // Find new campus
            const newCampus = await Campus.findOne({
                where: {
                    id: newCampusId,
                },
            });

            // Set our variables
            student.CampusId = newCampusId;
            student.setCampus(newCampus);
        }

        // Save changes
        await student.save();

        // Find instance again now
        const newStudent = await Student.findOne({
            where: {
                id,
            },
            include: {
                model: Campus,
            },
        });

        res.status(200).send(newStudent);
    } catch (err) {
        console.group(err);
        switch (err.errors[0].type) {
            case "Validation error || notNull Violation":
                res.sendStatus(422);
            case "unique violation":
                res.sendStatus(409);
            default:
                next(err);
        }
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        await Student.destroy({
            where: {
                id,
            },
        });
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        // Get individual student with campus joined
        const { id } = req.params;
        const oneStudent = await Student.findOne({
            where: {
                id: id,
            },
            include: {
                model: Campus,
            },
        });

        // Return proper status
        if (oneStudent !== null) {
            res.status(200).send(oneStudent);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
