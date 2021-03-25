// Server setup
const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");

// Routers
const apiRouter = require("./api");

// Database imports
const {
    db,
    seed,
    model: { Campus, Student },
} = require("./db");

// Seeds database with original data (uncomment for persistent database)
// seed();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(morgan("dev"));

// Server api
app.use("/api", apiRouter);

// Send the app
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message || "Internal server error");
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () =>
    console.log(`
        Listening on Port ${PORT}
        http://localhost:${PORT}
`),
);
