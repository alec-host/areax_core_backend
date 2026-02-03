const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const InstagramUserData = sequelize.define('InstagramUserData', {
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
        id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        user_id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        account_type: {
            type: DataTypes.STRING(145),
            allowNull: false
        },
        profile_picture_url: {
            type: DataTypes.STRING(2048),
            allowNull: true
        },
        followers_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        follows_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        media_count: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        is_revoked: {
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
        tableName: 'tbl_ig_datas',
        timestamps: false,
        id: false,
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return InstagramUserData;
};

