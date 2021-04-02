// Server setup
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5005;

// Routers
const apiRouter = require("./api");

// Database imports
const {
    db,
    seedOnce,
    seed,
    model: { Campus, Student },
} = require("./db");

// Will only seed if there is no data
seedOnce();

// Will refresh the seed data every time
// seed();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

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

app.listen(PORT, () =>
    console.log(`
        Listening on Port ${PORT}
        http://localhost:${PORT}
`),
);

module.exports = { app, PORT };
