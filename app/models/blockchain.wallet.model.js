const { DataTypes } = require('sequelize');

// Define the BlockchainWallet model
module.exports = (sequelize, Sequelize) => {
    const BlockchainWallet = sequelize.define('BlockchainWallet', {
        _id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
	    field: '_id'
        },
        reference_number: {
            type: DataTypes.STRING(145), // Reverted to 45 as per original
            allowNull: false
        },
        wallet_address: {
            type: DataTypes.STRING(145),
            allowNull: false
        },
        private_key: {
            type: DataTypes.STRING(145), // Reverted to 100 as per original
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: DataTypes.DATE, // Restored updated_at
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        indexes: [{
            name: 'idx_blockchain_wallet', // Reverted index name
            unique: false,
            fields: ['reference_number', 'wallet_address'] // Reverted index fields
        }],
        timestamps: false,
	id: false,    
        tableName: 'tbl_blockchain_wallet', // Reverted table name
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return BlockchainWallet;
};

