const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const TikTokToken = sequelize.define('TikTokToken', {
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
        refresh_token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        open_id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        expires_in: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        refresh_expires_in: {
            type: DataTypes.INTEGER,
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
        tableName: 'tbl_tiktok_tokens',
        timestamps: false,
        id: false,
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return TikTokToken;
};

