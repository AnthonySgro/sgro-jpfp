const express = require("express");
const router = express.Router();

// Database imports
const {
    db,
    model: { Campus, Student },
} = require("../../db");

router.get("/", async (req, res, next) => {
    try {
        // Get all campuses
        const allStudents = await Student.findAll({
            include: {
                model: Campus,
            },
        });

        // Return proper status
        res.status(200).send(allStudents);
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
            res.sendStatus(201);
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
        const { id } = req.params;
        const { firstName, lastName } = req.body;
        let { gpa } = req.body;

        let student = await Student.findOne({
            where: {
                id: id,
            },
        });

        // If student not found, return 404
        if (student === null) {
            res.sendStatus(404);
        }

        if (gpa === "N/A" || gpa === "") {
            gpa = null;
        }

        // Update values
        student.firstName = firstName;
        student.lastName = lastName;
        student.gpa = gpa || 0;
        await student.save();

        res.sendStatus(204);
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
        console.log(err);
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
