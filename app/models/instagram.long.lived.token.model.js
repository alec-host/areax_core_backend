const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const InstagramLongLivedToken = sequelize.define('InstagramLongLivedToken', {
        _id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
	    field: '_id'	
        },
        reference_number: {
            type: DataTypes.STRING(145), // Updated to 145
            unique: true,
            allowNull: false,
            comment: 'FK'
        },
        access_token: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        long_lived_token: {
            type: DataTypes.STRING(250),
            allowNull: false
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
                fields: ['reference_number'],
                using: 'BTREE',
            },
        ],
        timestamps: false,
	id: false,    
        tableName: 'tbl_instagram_token', // Singular 'token' as per original
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return InstagramLongLivedToken;
};

