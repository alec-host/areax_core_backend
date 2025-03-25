const { DataTypes } = require('sequelize');

// Define the GeneratedOTP model
module.exports = (sequelize, Sequelize) => {
    const OTP = sequelize.define('OTP', {
    _id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: true       
    },
    message: {
        type: DataTypes.STRING(160),
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
    is_sent: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
    },{
        indexes: [{
            name: 'idx_generated_otps',
            unique: false,
            fields : ['phone','is_sent'] 
        }],
        timestamps: false,
        tableName: 'tbl_generated_otps'
    });
  
    return OTP;
};