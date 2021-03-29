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
        const { page } = req.query;
        if (!page) {
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
        } else {
            // Catch invalid page request
            if (page < 1) {
                res.sendStatus(400);
            }

            // Returns a paginated list based on the page we input
            const paginatedCampuses = await Campus.findAll({
                attributes: [
                    "Campuses.*",
                    [db.fn("COUNT", db.col("Students.id")), "studentCount"],
                ],
                include: [
                    {
                        model: Student,
                        attributes: [],
                        duplicating: false,
                    },
                ],
                group: ["Campuses.id"],
                raw: true,
                order: [["id", "ASC"]],
                limit: 10,
                offset: 10 * parseInt(page) - 10,
            });

            // Return all campuses
            res.status(200).send(paginatedCampuses);
        }
    } catch (err) {
        next(err);
    }
});

// Creates a campus
router.post("/", async (req, res, next) => {
    try {
        const { name, address, description } = req.body;
        let { imgUrl } = req.body;

        // If url is empty, give it the default value
        if (imgUrl === "") {
            imgUrl =
                "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Media_Viewer_Icon_-_Location.svg/1200px-Media_Viewer_Icon_-_Location.svg.png";
        }

        const newCampus = await Campus.create({
            name,
            address,
            description,
            imgUrl,
        });

        if (newCampus !== null) {
            // Return a 201 code and the new campuses
            res.status(201).send(newCampus);
        }

        // Error handling
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

// Updates a campus
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, address } = req.body;

        let campus = await Campus.findOne({
            where: {
                id: id,
            },
            include: {
                model: Student,
            },
        });

        // If student not found, return 404
        if (campus === null) {
            res.sendStatus(404);
        }

        // Update values
        campus.name = name;
        campus.description = description;
        campus.address = address;

        await campus.save();

        res.status(200).send(campus);
    } catch (err) {
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
