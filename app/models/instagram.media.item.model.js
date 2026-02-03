const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const InstagramMediaItem = sequelize.define('InstagramMediaItem', {
        _id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            field: '_id'		
        },
        media_item_id: {
            type: DataTypes.STRING(250),
            unique: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        caption: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image_url: {
            type: DataTypes.TEXT, // Original was TEXT('long'), TEXT is postgres equiv
            allowNull: false
        },
        like_count: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        comment_count: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        engagement: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        share_link: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        is_minted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_already_mint_for_multiple: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        indexes: [{
            name: 'media_item_id_index',
            fields: ['media_item_id']
        },
        {
            name: 'is_minted_index',
            fields: ['is_minted']
        },
        {
            name: 'is_already_mint_for_multiple_index',
            fields: ['is_already_mint_for_multiple']
        }],
        timestamps: false,
	id: false,    
        tableName: 'tbl_instagram_media_item', // Singular item
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return InstagramMediaItem;
};

