const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const InstagramMedia = sequelize.define('InstagramMedia', {
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
        id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        caption: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        media_type: {
            type: DataTypes.STRING(145),
            allowNull: false
        },
        media_url: {
            type: DataTypes.STRING(2048),
            allowNull: false
        },
        permalink: {
            type: DataTypes.STRING(2048),
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
        tableName: 'tbl_ig_media_items',
        timestamps: false,
        id: false,
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return InstagramMedia;
};

