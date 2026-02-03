const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const InstagramSession = sequelize.define('InstagramSession', {
        _id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            field: '_id'		
        },
        username: {
            type: DataTypes.STRING(65),
            allowNull: false
        },
        session: {
            type: DataTypes.TEXT, // Original was TEXT, keeping as TEXT or JSON if widely supported. Agnostic strategy prefers JSON for structured data but if this is just a string, TEXT IS SAFER for now to match 'original'.
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        is_revoked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        indexes: [
            {
                name: 'username_index',
                fields: ['username'],
                using: 'BTREE',
            },
            {
                name: 'is_revoked_index',
                fields: ['is_revoked'],
                using: 'BTREE',
            }
        ],
        timestamps: false,
	id: false,    
        tableName: 'tbl_instagram_session', // Singular 'session' as per original
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return InstagramSession;
};

