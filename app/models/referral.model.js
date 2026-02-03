const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const AreaXReferral = sequelize.define('AreaXReferral', {
    _id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: '_id'	    
    },
    referrer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_areax_users', // logical table name
        key: '_id',
      },
      comment: 'The user who shared the code',
    },
    referrer_reference_number: {
      type: DataTypes.STRING(145),
      allowNull: false,
      comment: 'unnormalize -ref a',
    },
    referral_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      comment: 'Unique code for this specific invite',
    },
    invitee_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    invitee_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    invitee_mobile_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    referee_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'tbl_areax_users',
        key: '_id',
      },
      comment: 'The new user who signed up',
    },
    referee_reference_number: {
      type: DataTypes.STRING(145),
      allowNull: true,
      unique: 'uniq_tbl_areax_referral_reference_number_b',
      comment: 'unnormalize -ref b',
    },
    status: {
      type: DataTypes.ENUM(
        'invited',
        'downloaded',
        'sign_up',
        'active',
        'subscribed',
        'recharged',
        'withdrawn',
        'paid',
        'fraud'
      ),
      defaultValue: 'invited',
      comment:
        'Lifecycle: invited -> downloaded -> sign_up -> active -> subscribed/recharged -> paid',
    },
    reward_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    device_fingerprint: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Unique device identifier to detect fraud/multiple accounts',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    tableName: 'tbl_areax_referrals',
    timestamps: false,
    id: false,	  
    indexes: [
      {
        name: 'idx_referrals_referrer_status',
        fields: ['referrer_id', 'status'],
      },
      { name: 'idx_referrals_device_fingerprint', fields: ['device_fingerprint'] },
      { name: 'idx_referrer_reference_number', fields: ['referrer_reference_number'] },
      { name: 'idx_referee_reference_number', fields: ['referee_reference_number'] },
    ],
  });

  return AreaXReferral;
};
