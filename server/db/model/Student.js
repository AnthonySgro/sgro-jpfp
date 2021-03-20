const { Sequelize, DataTypes, Model } = require("sequelize");
const db = require("../db");
const Campus = require("./Campus");

class Student extends Model {}

Student.init(
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
            validate: {
                notEmpty: true,
            },
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
            validate: {
                notEmpty: true,
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        imgUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            validate: {
                isUrl: true,
            },
        },
        gpa: {
            type: DataTypes.DECIMAL(10, 1),
            allowNull: true,
            validate: {
                isDecimal: true,
                min: 0.0,
                max: 4.0,
            },
        },
    },
    {
        hooks: {},
        timestamps: false,
        sequelize: db,
        modelName: "Students",
    },
);

Campus.hasMany(Student);
Student.belongsTo(Campus);

module.exports = Student;
