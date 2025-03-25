const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const InstagramActivityLogs = sequelize.define('InstagramActivityLogs', {
    _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    reference_number: {
        type: DataTypes.STRING(65),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    route: {
        type: DataTypes.STRING(40),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    operation_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    client_type: {
        type: DataTypes.STRING(15),
        allowNull: false,
        collate: 'utf8mb4_general_ci',       
    },
    service: {
        type: DataTypes.STRING(15),
	allowNull: true,
	collate: 'utf8mb4_general_ci',    
    },
    state: {
        type: DataTypes.STRING(150),
        allowNull: true,
        collate: 'utf8mb4_general_ci',
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
    }, {
    indexes: [
        {
        name: 'reference_number_index',
        fields: ['reference_number','service'],
        using: 'BTREE',
        },
    ],
    timestamps: false,
    tableName: 'tbl_ig_activity_logs',
    collate: 'utf8mb4_general_ci',
    engine: 'InnoDB',
    });

    return InstagramActivityLogs;
};
