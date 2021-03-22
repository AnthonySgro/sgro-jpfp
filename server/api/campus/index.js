const express = require("express");
const router = express.Router();

// Database imports
const {
    db,
    model: { Campus, Student },
} = require("../../db");

// Sends information about the database back
router.get("/", async (req, res, next) => {
    try {
        // Get all campuses and number of students
        const allCampuses = await Campus.findAll({
            attributes: [
                "Campuses.*",
                [db.fn("COUNT", db.col("Students.id")), "studentCount"],
            ],
            include: [
                {
                    model: Student,
                    attributes: [],
                    include: [],
                },
            ],
            group: ["Campuses.id"],
            raw: true,
        });

        // Return all campuses
        res.status(200).send(allCampuses);
    } catch (err) {
        next(err);
    }
});

// Creates a campus
router.post("/", async (req, res, next) => {
    try {
        const { name, address, description } = req.body;

        const newCampus = await Campus.create({
            name,
            address,
            description,
        });

        if (newCampus !== null) {
            // Return a 201 code and all campuses
            res.sendStatus(201);
        }

        // Error handling
    } catch (err) {
        console.log(err);
        switch (err.errors[0].type) {
            case "Validation error":
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
        await Campus.destroy({
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
        // Get designated campus database with students
        const { id } = req.params;
        const oneCampus = await Campus.findOne({
            where: {
                id: id,
            },
            include: {
                model: Student,
            },
        });

        // Return proper status
        if (oneCampus !== null) {
            res.status(200).send(oneCampus);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
