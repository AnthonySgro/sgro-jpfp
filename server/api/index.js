const express = require("express");
const router = express.Router();
const campusApi = require("./campus");
const studentApi = require("./student");

router.use("/campuses", campusApi);
router.use("/students", studentApi);

module.exports = router;
