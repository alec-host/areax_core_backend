const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const InstagramUserData = sequelize.define('InstagramUserData', {
        _id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            field: '_id'		
        },
        _profile_data: {
            type: DataTypes.JSON,
            allowNull: true
        },
        _media_details: {
            type: DataTypes.JSON,
            allowNull: true
        },
        _llm_prompts: {
            type: DataTypes.JSON,
            allowNull: true
        },
        reference_number: {
            type: DataTypes.STRING(145), // Updated to 145
            allowNull: false,
            unique: true,
            comment: 'FK'
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
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        indexes: [{
            name: 'reference_number_index',
            fields: ['reference_number']
        },
        {
            name: 'is_revoked_index',
            fields: ['is_revoked']
        },
        {
            name: 'is_deleted_index',
            fields: ['is_deleted']
        }],
        timestamps: false,
	id: false,    
        tableName: 'tbl_ig_data',
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return InstagramUserData;
};
