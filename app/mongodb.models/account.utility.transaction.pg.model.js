const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const UtilityTransaction = sequelize.define('UtilityTransaction', {
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
        cr: {
            type: DataTypes.DECIMAL(20, 2),
            defaultValue: 0.00
        },
        dr: {
            type: DataTypes.DECIMAL(20, 2),
            defaultValue: 0.00
        },
        running_balance: {
            type: DataTypes.DECIMAL(20, 2),
            defaultValue: 0.00
        },
        particular: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        is_archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
        tableName: 'tbl_utility_transaction',
        timestamps: false,
        id: false,
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return UtilityTransaction;
};

