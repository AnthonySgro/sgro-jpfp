const { Sequelize, DataTypes, Model } = require("sequelize");
const db = require("../db");

class Campus extends Model {
    // Instance Methods
}

Campus.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        imgUrl: {
            type: DataTypes.STRING(2000),
            defaultValue:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Media_Viewer_Icon_-_Location.svg/1200px-Media_Viewer_Icon_-_Location.svg.png",
            validate: {
                isUrl: true,
            },
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        description: {
            type: DataTypes.STRING(2000),
            allowNull: true,
        },
    },
    {
        timestamps: false,
        sequelize: db,
        modelName: "Campuses",
    },
);

module.exports = Campus;
