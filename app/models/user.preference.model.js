const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const UserPreference = sequelize.define('UserPreferences', {
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
            allowNull: true
        },
        preferences: {
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
        },
        is_archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        indexes: [{
            name: 'idx_user_profiles',
            unique: false,
            fields: ['reference_number', 'is_archived', 'is_deleted']
        }],
        // Define table options
        timestamps: false,
	id: false,    
        tableName: 'tbl_user_preferences',
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return UserPreference;
};
