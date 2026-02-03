const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const SubscriptionTier = sequelize.define('SubscriptionTier', {
        _id: {
            type: DataTypes.BIGINT, // Mapped from id (INTEGER)
            primaryKey: true,
            autoIncrement: true,
            field: '_id'		
        },
        reference_number: {
            type: DataTypes.STRING(145),
            allowNull: false,
            unique: 'uniq_tbl_admin_subscription_tiers_reference_number'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        monthly_cost: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        yearly_cost: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        campaign_specific_price: {
            type: DataTypes.STRING,
            allowNull: true
        },
        entry: {
            type: DataTypes.STRING,
            allowNull: false
        },
        benefits: {
            type: DataTypes.TEXT, // Converted TEXT -> JSON
            allowNull: false
        },
        credits_per_action: {
            type: DataTypes.FLOAT,
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
        is_hidden: {
            type: DataTypes.BOOLEAN, // Converted INTEGER -> BOOLEAN
            defaultValue: false
        },
        is_deleted: {
            type: DataTypes.BOOLEAN, // Converted INTEGER -> BOOLEAN
            defaultValue: false
        }
    }, {
        indexes: [{
            name: 'idx_subscription_tiers',
            unique: true,
            fields: ['name', 'is_deleted', 'is_hidden']
        },
        {
            name: 'uniq_tbl_admin_subscription_tiers_reference_number',
            unique: true,
            fields: ['reference_number'],
        }],
        timestamps: false,
	id: false,    
        tableName: 'tbl_subscription_tiers', // Original table name
        hooks: {
            beforeUpdate: (instance) => {
                instance.updated_at = new Date();
            }
        }
    });

    return SubscriptionTier;
};

