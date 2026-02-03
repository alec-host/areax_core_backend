const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const UserLocation = sequelize.define('UserLocation', {
        _id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            field: '_id'
        },
        reference_number: {
            type: DataTypes.STRING(145),
            unique: true,
            allowNull: false
        },
        lat: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        lng: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        tableName: 'tbl_user_location',
        timestamps: false,
        id: false,
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return UserLocation;
};

