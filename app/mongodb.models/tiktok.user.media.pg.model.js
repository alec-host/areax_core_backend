const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const TikTokMedia = sequelize.define('TikTokMedia', {
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
        user_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        publish_id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        upload_url: {
            type: DataTypes.STRING(2048),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        caption: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        like_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        comments_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        is_minted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
        tableName: 'tbl_tiktok_medias',
        timestamps: false,
        id: false,
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return TikTokMedia;
};

