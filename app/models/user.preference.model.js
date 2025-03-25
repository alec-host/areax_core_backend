const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const UserPreference = sequelize.define('UserPreferences', {
        _id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        reference_number: {
            type: DataTypes.STRING(65),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(65),
            allowNull: true
        },
        preferences: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        is_archived: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        is_deleted: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },{
        indexes: [{
            name: 'idx_user_profiles',
            unique: false,
            fields : ['reference_number','is_archived','is_deleted'] 
        }],
        // Define table options
        timestamps: false,
        tableName: 'tbl_user_preferences'
    });
    
    return UserPreference;
};