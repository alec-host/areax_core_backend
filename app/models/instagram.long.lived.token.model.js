const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const InstagramLongLivedToken = sequelize.define('InstagramLongLivedToken', {
    _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    reference_number: {
        type: DataTypes.STRING(65),
        unique: true,
        allowNull: false,
        comment: 'FK',
        collate: 'utf8mb4_general_ci',
    },
    access_token: {
        type: DataTypes.STRING(250),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    long_lived_token: {
        type: DataTypes.STRING(250),
        allowNull: false,
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
    }, {
    indexes: [
        {
        name: 'reference_number_index',
        fields: ['reference_number'],
        using: 'BTREE',
        },
    ],
    timestamps: false,
    tableName: 'tbl_instagram_token',
    collate: 'utf8mb4_general_ci',
    engine: 'InnoDB',
    });

    return InstagramLongLivedToken;
};
