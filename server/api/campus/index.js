const express = require("express");
const router = express.Router();

// Database imports
const {
    db,
    model: { Campus, Student },
} = require("../../db");

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
