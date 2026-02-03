const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const InstagramActivityLogs = sequelize.define('InstagramActivityLogs', {
        _id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            field: '_id'		
        },
        reference_number: {
            type: DataTypes.STRING(145), // Updated to 145
            allowNull: false
        },
        route: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        operation_type: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        client_type: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        service: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        state: {
            type: DataTypes.STRING(150),
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
        indexes: [
            {
                name: 'reference_number_index',
                fields: ['reference_number', 'service'],
                using: 'BTREE',
            },
        ],
        timestamps: false,
        id: false,	    
        tableName: 'tbl_ig_activity_logs',
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return InstagramActivityLogs;
};
