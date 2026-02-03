const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
   const UserPurged = sequelize.define('UserPurged', {
      _id: {
         type: DataTypes.BIGINT,
         primaryKey: true,
         autoIncrement: true,
	 field: '_id'     
      },
      reference_number: {
         type: DataTypes.STRING(145),
         allowNull: false
      },
      google_user_id: {
         type: DataTypes.STRING(255),
         allowNull: false
      },
      email: {
         type: DataTypes.STRING(145),
         allowNull: false
      },
      phone: {
         type: DataTypes.STRING(20),
         allowNull: true
      },
      username: DataTypes.STRING(255),
      display_name: DataTypes.STRING(255),
      profile_picture_url: DataTypes.STRING(255),
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
         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      email_verified: {
         type: DataTypes.BOOLEAN,
         defaultValue: false
      },
      phone_verified: {
         type: DataTypes.BOOLEAN,
         defaultValue: false
      },
      is_online: {
         type: DataTypes.BOOLEAN,
         defaultValue: false
      },
      is_deleted: {
         type: DataTypes.BOOLEAN,
         defaultValue: false
      }
   }, {
      indexes: [{
         name: 'idx_areax_purgeed_users',
         unique: false,
         fields: ['reference_number', 'phone', 'email', 'email_verified', 'phone_verified', 'is_online', 'is_deleted']
      }],
      timestamps: false,
      id: false,	   
      tableName: 'tbl_areax_purged_users',
      hooks: {
         beforeUpdate: (instance) => {
            instance.updated_at = new Date();
         }
      }
   });

   return UserPurged;
};

