const { DataTypes } = require('sequelize');

// Define the BlockchainWallet model
module.exports = (sequelize, Sequelize) => {
    const BlockchainWallet = sequelize.define('BlockchainWallet', {
    _id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reference_number: {
        type: DataTypes.STRING(45),
        allowNull: false       
    },
    wallet_address: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    private_key: {
        type: DataTypes.STRING(100),
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
    },{
        indexes: [{
            name: 'idx_blockchain_wallet',
            unique: false,
            fields : ['reference_number','wallet_address'] 
        }],
        timestamps: false,
        tableName: 'tbl_blockchain_wallet'
    });
  
    return BlockchainWallet;
};
