const { Sequelize, DataTypes, Model } = require("sequelize");
const db = require("../db");
const parseAddress = require("parse-address-string");
const { Student } = require("../");

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
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Media_Viewer_Icon_-_Location.svg/1200px-Media_Viewer_Icon_-_Location.svg.png",
            validate: {
                isUrl: true,
            },
        },
        street: {
            type: DataTypes.STRING,
            defaultValue: "Street",
        },
        city: {
            type: DataTypes.STRING,
        },
        state: {
            type: DataTypes.STRING,
        },
        zip: {
            type: DataTypes.STRING,
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
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        hooks: {
            async afterSave(campus, options) {
                try {
                    // If we are updating/creating address
                    if (options.fields.includes("address")) {
                        // Returns a promise after parsing the address
                        const getSplitAddress = (address) => {
                            return new Promise((res, rej) => {
                                // Address parser
                                parseAddress(address, (err, addressObj) => {
                                    if (err) {
                                        return rej(err);
                                    }
                                    res(addressObj);
                                });
                            });
                        };

                        // Deconstruct split address variables
                        const {
                            street_address1,
                            city,
                            postal_code,
                            state,
                        } = await getSplitAddress(campus.address);

                        // Updates Campus instance
                        await Campus.update(
                            {
                                street: street_address1,
                                city: city,
                                zip: postal_code,
                                state: state,
                            },
                            {
                                where: {
                                    id: campus.id,
                                },
                            },
                        );
                    }
                } catch (err) {
                    console.log(err);
                }
            },
        },
        timestamps: false,
        sequelize: db,
        modelName: "Campuses",
    },
);

module.exports = Campus;
