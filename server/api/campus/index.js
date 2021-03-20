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
        const allCampuses = await Campus.findAll();

        // Return proper status
        if (allCampuses.length) {
            res.status(200).send(allCampuses);
        } else {
            res.sendStatus(404);
        }
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
