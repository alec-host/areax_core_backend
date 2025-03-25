const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const InstagramUserDataArchive = sequelize.define('InstagramUserDataArchive', {
    _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    _profile_data: {
        type: DataTypes.TEXT,
        collate: 'utf8mb4_general_ci',
    },
    _media_details: {
        type: DataTypes.TEXT,
        collate: 'utf8mb4_general_ci',
    },
    _llm_prompts: {
        type: DataTypes.TEXT,
        collate: 'utf8mb4_general_ci',
    },
    reference_number: {
        type: DataTypes.STRING(65),
        allowNull: false,
        comment: 'FK',
        collate: 'utf8mb4_general_ci',
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {   
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    is_revoked: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_deleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    }, {
    indexes: [
        {
        name: 'reference_number_index',
        fields: ['reference_number'],
        using: 'BTREE',
        },
        {
        name: 'is_revoked_index',
        fields: ['is_revoked'],
        using: 'BTREE',
        },
        {
        name: 'is_deleted_index',
        fields: ['is_deleted'],
        using: 'BTREE',
        },
    ],
    timestamps: false,
    tableName: 'tbl_ig_data_archive',
    collate: 'utf8mb4_general_ci',
    engine: 'InnoDB',
    });
    
    return InstagramUserDataArchive;
};