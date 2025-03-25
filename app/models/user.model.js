const { DataTypes } = require('sequelize');

// Define the User model
module.exports = (sequelize, Sequelize) => {
   const User = sequelize.define('User', {
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
      google_user_id: {
         type: DataTypes.STRING(255),
         allowNull: false
      },
      email: {
         type: DataTypes.STRING(65),
         allowNull: false
      },
      phone: {
         type: DataTypes.STRING(20),
         allowNull: true
      },	   
      username: DataTypes.STRING(255),
      display_name: DataTypes.STRING(255),
      profile_picture_url: DataTypes.STRING(255),
      caption: DataTypes.STRING(160),
      tier_reference_number: {
         type: DataTypes.STRING(65),
         allowNull: true
      },	   
      country: {
         type: DataTypes.STRING(65),
         allowNull: true
      },
      city: {
         type: DataTypes.STRING(65),
         allowNull: true
      },
      access_token: DataTypes.STRING(255),
      refresh_token: DataTypes.STRING(255),
      token_expiry: DataTypes.DATE,
      password: DataTypes.STRING(65),
      token_id: DataTypes.STRING(70),
      hashed_token_id: DataTypes.STRING(70),
      created_at: {
         type: DataTypes.DATE,
         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
         type: DataTypes.DATE,
         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
         onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      email_verified: {
         type: DataTypes.INTEGER,
         defaultValue: 0
      },
      phone_verified: {
         type: DataTypes.INTEGER,
         defaultValue: 0
      },
      is_online: {
         type: DataTypes.INTEGER,
         defaultValue: 0
      },
      is_deleted: {
         type: DataTypes.INTEGER,
         defaultValue: 0
      }
      },{
         indexes: [{
            name: 'idx_areax_users',
            unique: false,
            fields : ['reference_number','phone','email','email_verified','phone_verified','is_online','is_deleted'] 
        }],
         // Define table options
         timestamps: false,
         tableName: 'tbl_areax_users'
      });

      return User;
};
