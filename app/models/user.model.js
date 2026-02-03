const { DataTypes } = require('sequelize');

// Define the User model
module.exports = (sequelize, Sequelize) => {
   const User = sequelize.define('User', {
      _id: {
         type: DataTypes.BIGINT,
         primaryKey: true,
         autoIncrement: true,
	 field: '_id'     
      },
      reference_number: {
         type: DataTypes.STRING(145),
         unique: 'uniq_tbl_areax_users_reference_number',
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
      country_code: {
         type: DataTypes.STRING(5),
         allowNull: true
      },
      username: {
         type: DataTypes.STRING(255),
         allowNull: true
      },
      display_name: {
         type: DataTypes.STRING(255),
         allowNull: true
      },
      profile_picture_url: {
         type: DataTypes.STRING(2048),
         allowNull: true,
         validate: {
            isUrl: {
               msg: "Invalid URL format."
            },
         }
      },
      caption: {
         type: DataTypes.TEXT,
         allowNull: true
      },
      guardian_picture_url: {
         type: DataTypes.STRING(2048),
         allowNull: true,
         validate: {
            isUrl: {
               msg: "Invalid URL format."
            },
         }
      },
      wallpaper_picture_url: {
         type: DataTypes.STRING(2048),
         allowNull: true,
         validate: {
            isUrl: {
               msg: "Invalid URL format."
            },
         }
      },
      tier_reference_number: {
         type: DataTypes.STRING(145),
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
      referral_code: { type: DataTypes.STRING(10), unique: 'uniq_tbl_areax_referral_code', allowNull: true },
      lat: { type: DataTypes.DECIMAL(8, 6), allowNull: true }, // -90..90
      lon: { type: DataTypes.DECIMAL(9, 6), allowNull: true }, // -180..180 	   
      time_zone: {
         type: DataTypes.STRING(75),
         allowNull: true
      },
      access_token: DataTypes.STRING(500),
      refresh_token: DataTypes.STRING(500),
      token_expiry: DataTypes.DATE,
      password: DataTypes.STRING(145),
      token_id: DataTypes.STRING(145),
      hashed_token_id: DataTypes.STRING(145),
      privacy_status: {
         type: DataTypes.ENUM("public", "private", "anonymous"),
         defaultValue: "public",
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
         name: 'idx_areax_users',
         unique: false,
         fields: ['phone', 'country_code', 'email', 'privacy_status', 'email_verified', 'phone_verified', 'is_online', 'is_deleted']
      },
      {
         name: 'uniq_tbl_areax_users_reference_number',
         unique: true,
         fields: ['reference_number'],
      },
      //{ name: 'idx_users_email_fp', fields: ['email_fp'] },
      //{ name: 'idx_users_phone_fp', fields: ['phone_fp'] },
      { name: 'idx_users_time_zone', fields: ['time_zone'] },
      { name: 'idx_users_lat_lon', fields: ['lat', 'lon'] } // for bbox prefilter	 
      ],
      // Define table options
      timestamps: false,
      id: false ,	   
      tableName: 'tbl_areax_users',
      hooks: {
         beforeUpdate: (instance) => {
            instance.updated_at = new Date();
         }
      }
   });


   return User;
};

