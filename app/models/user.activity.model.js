const { DataTypes } = require('sequelize');

// Define the UserActivity model
module.exports = (sequelize, Sequelize) => {
    const UserActivity = sequelize.define('UserActivity', { // Reverted model name
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
        username: {
            type: DataTypes.STRING(145),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(145),
            allowNull: false
        },
        activity: {
            type: DataTypes.JSON, // JSON is definitely better than TEXT here
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        is_archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        indexes: [{
            name: 'idx_user_activity',
            unique: false,
            fields: ['reference_number', 'is_archived']
        }],
        // Define table options
        timestamps: false,
	id: false,
        tableName: 'tbl_user_activities',
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return UserActivity;
};
