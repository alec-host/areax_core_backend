const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const TikTokUserData = sequelize.define('TikTokUserData', {
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
        open_id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        union_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        display_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        avatar_url: {
            type: DataTypes.STRING(2048),
            allowNull: true
        },
        bio_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        follower_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        following_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        likes_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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
        tableName: 'tbl_tiktok_datas',
        timestamps: false,
        id: false,
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return TikTokUserData;
};

