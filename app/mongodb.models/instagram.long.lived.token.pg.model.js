const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const InstagramToken = sequelize.define('InstagramToken', {
        _id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            field: '_id'
        },
        reference_number: {
            type: DataTypes.STRING(145),
            unique: true,
            allowNull: false
        },
        access_token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        long_lived_token: {
            type: DataTypes.TEXT,
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
        tableName: 'tbl_instagram_tokens',
        timestamps: false,
        id: false,
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return InstagramToken;
};

