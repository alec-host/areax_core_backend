const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const UserActivity = sequelize.define('UserActivity', {
        _id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            field: '_id'
        },
        reference_number: {
            type: DataTypes.STRING(145),
            allowNull: false
        },
        activity_type: {
            type: DataTypes.STRING(145),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        tableName: 'tbl_user_activities_mongo_parallel',
        timestamps: false,
        id: false,
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return UserActivity;
};

