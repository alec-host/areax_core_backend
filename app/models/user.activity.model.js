const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

// Define the UserActivity model
module.exports = (sequelize, Sequelize) => {
    const UserActivity = sequelize.define('UserActivity', {
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
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(65),
            allowNull: false
        },
        activity: {
            type: DataTypes.TEXT,
            allowNull: false
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
        }
        },{
            indexes: [{
                name: 'idx_user_activities',
                unique: false,
                fields : ['reference_number','is_archived'] 
            }],
            timestamps: false,
            tableName: 'tbl_user_activities'
        });
  
    return UserActivity;
};