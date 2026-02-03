const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
   const Wallet = sequelize.define('Wallet', {
      _id: {
         type: DataTypes.BIGINT,
         primaryKey: true,
         autoIncrement: true,
	 field: '_id'     
      },
      reference_number: {
         type: DataTypes.STRING(145),
         unique: 'uniq_tbl_areax_wallets_reference_number',
         allowNull: false
      },
      amount: {
         type: DataTypes.DECIMAL(15, 2),
         allowNull: false,
         defaultValue: 0.00
      },
      credit_points_bought: {
         type: DataTypes.DECIMAL(15, 2),
         defaultValue: 0.00
      },
      bonus_points_earned: {
         type: DataTypes.DECIMAL(15, 2),
         defaultValue: 0.00
      },
      plan_name: {
         type: DataTypes.STRING(20),
         defaultValue: 'STARTER'
      },
      tier_reference_number: {
         type: DataTypes.STRING(145),
         allowNull: true
      },
      subscription_plan: {
         type: DataTypes.STRING(2),
         defaultValue: 'm'
      },
      expired_at: {
         type: DataTypes.DATE,
         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      currency_code: {
         type: DataTypes.STRING(3),
         defaultValue: 'USD'
      },
      created_at: {
         type: DataTypes.DATE,
         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
         type: DataTypes.DATE,
         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      is_suspended: {
         type: DataTypes.BOOLEAN,
         defaultValue: false
      },
      is_deleted: {
         type: DataTypes.BOOLEAN,
         defaultValue: false
      }
   }, {
      indexes: [{
         name: 'idx_wallets',
         unique: false,
         fields: ['reference_number', 'is_suspended', 'is_deleted']
      },
      {
         name: 'uniq_tbl_areax_wallets_reference_number',
         unique: true,
         fields: ['reference_number'],
      }],
      // Define table options
      timestamps: false, // We're handling timestamps manually
      id: false,	   
      tableName: 'tbl_areax_wallets',
      hooks: {
         beforeUpdate: (instance) => {
            instance.updated_at = new Date();
         }
      }
   });

   return Wallet;
};

