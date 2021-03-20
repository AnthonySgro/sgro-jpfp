const { Sequelize } = require("sequelize");
const db = new Sequelize(process.env.DATABASE_URL || "jpfp", {
    logging: false,
});

module.exports = db;
