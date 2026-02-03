const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const SystemError = sequelize.define('SystemError', {
        _id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            field: '_id'
        },
        error_code: {
            type: DataTypes.STRING(145),
            allowNull: false
        },
        error_message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        stack_trace: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        module_name: {
            type: DataTypes.STRING(145),
            allowNull: true
        },
        severity: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            defaultValue: 'medium'
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        tableName: 'tbl_system_errors',
        timestamps: false,
        id: false
    });

    return SystemError;
};

