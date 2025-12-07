const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const AreaXReferral = sequelize.define('AreaXReferral', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        referrer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tbl_areax_users', // Name of the User table
                key: '_id'
            },
            comment: "The user who shared the code"
        },
        referrer_reference_number: {
           type: DataTypes.STRING(105),
           unique: true,
           allowNull: false,
           unique: 'uniq_tbl_areax_referral_reference_number_a',
	   comment: "unnormalize -ref a"	
        },   
        referee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true, // A user can only be referred once
            references: {
                model: 'tbl_areax_users',
                key: '_id'
            },
            comment: "The new user who signed up"
        },
        referee_reference_number: {
           type: DataTypes.STRING(105),
           unique: true,
           allowNull: false,
           unique: 'uniq_tbl_areax_referral_reference_number_b',
	   comment: "unnormalize -ref b"	
        },	    
        status: {
            type: DataTypes.ENUM('sign_up', 'active','subscribed', 'paid', 'fraud'),
            defaultValue: 'sign_up',
            comment: "Funnel: signed_up -> active (activity) -> subscribed (paid) -> paid (reward sent)"
        },
        reward_amount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },
        device_fingerprint: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: "Unique device identifier to detect fraud/multiple accounts"
        },	    
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        tableName: 'tbl_areax_referrals',
        timestamps: false,
        indexes: [
            {
                name: 'idx_referrals_referrer_status',
                fields: ['referrer_id', 'status'] // Optimized for "How many qualified referrals does User X have?"
            },
            { name: 'idx_referrals_device_fingerprint', fields: ['device_fingerprint'] },		
	    { name: 'idx_referrer_reference_number', fields: ['referrer_reference_number'] },
	    { name: 'idx_referee_reference_number', fields: ['referee_reference_number'] },	
        ]
    });
    return AreaXReferral;
};
