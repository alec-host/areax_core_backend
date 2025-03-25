const { DataTypes } = require('sequelize');

// Define the Wallet model
module.exports = (sequelize, Sequelize) => {
   const Wallet = sequelize.define('Wallet', {
      _id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true
      },
      reference_number: {
         type: DataTypes.STRING(65),
	 unique: true,     
         allowNull: false
      },
      amount: {
         type: DataTypes.DECIMAL(10, 2),
         defaultValue: 0.0,
      },
      credit_points_bought: {
          type: DataTypes.DECIMAL(10, 2),
          defaultValue: 0.0,
      },
      bonus_points_earned: {
          type: DataTypes.DECIMAL(10, 2),
          defaultValue: 0.0,
      },
      plan_name: {
           type: DataTypes.STRING(20),
            defaultValue: 'STARTER'
      },	   
      tier_reference_number: {
         type: DataTypes.STRING(65),
         defaultValue: 0,	  
      },
      subscription_plan: {
	   type: DataTypes.STRING(2),
	    defaultValue: 'm'   
      },
      expired_at: {
         type: DataTypes.DATE,
         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },	   
      updated_at: {
         type: DataTypes.DATE,
         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
         onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      is_suspended: {
         type: DataTypes.INTEGER,
         defaultValue: 0
      },
      is_deleted: {
         type: DataTypes.INTEGER,
         defaultValue: 0
      }
      },{
         indexes: [{
            name: 'idx_wallets',
            unique: false,
            fields : ['reference_number','is_suspended','is_deleted']
        }],
         // Define table options
         timestamps: false,
         tableName: 'tbl_areax_wallets'
      });
      	
      return Wallet;
};
