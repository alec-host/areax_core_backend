const { DataTypes,Sequelize } = require('sequelize');

// Define the GeneratedOTP model
module.exports = (sequelize, Sequelize) => {
    const OTP = sequelize.define('OTP', {
        _id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            field: '_id'		
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(145),
            allowNull: true
        },
        message: {
            type: DataTypes.STRING(160), // Reverted length
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
        is_sent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        indexes: [{
            name: 'idx_generated_otps', // Reverted index name
            unique: false,
            fields: ['phone', 'is_sent'] // Reverted index fields
        }],
        timestamps: false,
	id: false,    
        tableName: 'tbl_generated_otps', // Reverted table name 
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });
    
    return OTP;
};
