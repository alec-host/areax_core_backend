const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const ReceiptData = sequelize.define('ReceiptData', {
        _id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            field: '_id'
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        reference_number: {
            type: DataTypes.STRING(145),
            allowNull: false
        },
        business_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        business_address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        contact_information: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        receipt_number: {
            type: DataTypes.STRING(145),
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        customer_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        line_item: {
            type: DataTypes.JSON, // Storing embedded line items as JSON
            allowNull: true
        },
        sub_total: {
            type: DataTypes.DECIMAL(20, 2),
            allowNull: false
        },
        taxes: {
            type: DataTypes.DECIMAL(20, 2),
            allowNull: false
        },
        total_amount: {
            type: DataTypes.DECIMAL(20, 2),
            allowNull: true
        },
        payment_method: {
            type: DataTypes.STRING(145),
            allowNull: true
        },
        is_deleted: {
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
        tableName: 'tbl_receipt',
        timestamps: false,
        id: false,
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return ReceiptData;
};

