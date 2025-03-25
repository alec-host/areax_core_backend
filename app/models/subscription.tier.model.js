const { DataTypes } = require('sequelize');

// Define the SubscriptionTier model
module.exports = (sequelize, Sequelize) => {
    const SubscriptionTier = sequelize.define('SubscriptionTier', {
    _id: {
        type: DataTypes.INTEGER,
	autoIncrement: true,    
        primaryKey: true
    },
    reference_number: {
         type: DataTypes.STRING(65),
         unique: true,
         allowNull: false,
         set(value) { 
           this.setDataValue('reference_number', `ST_${value}`); 
	 }	    
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
	 type: DataTypes.TEXT, 
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    is_hidden: {
	type: DataTypes.INTEGER,  
	defaultValue: 0    
    },    
    is_deleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
    },{
        indexes: [{
            name: 'idx_subscription_tiers',
            unique: true,
            fields : ['name','is_deleted','is_hidden']
        }],
        timestamps: false,
        tableName: 'tbl_subscription_tiers'
    });

    return SubscriptionTier;
};

