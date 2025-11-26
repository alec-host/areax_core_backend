'use strict';

const TABLE = 'tbl_areax_users';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Make columns big enough for AES-GCM envelope JSON (hex) strings
    await queryInterface.changeColumn(TABLE, 'email', {
      type: Sequelize.STRING(512),
      allowNull: false
    });

    await queryInterface.changeColumn(TABLE, 'google_user_id', {
      type: Sequelize.STRING(512),
      allowNull: false
    });

    await queryInterface.changeColumn(TABLE, 'phone', {
      type: Sequelize.STRING(128),
      allowNull: true
    });

    // (Optional) If you still have any index that includes 'email'/'phone',
    // it's not useful after encryption. Prefer queries by email_fp/phone_fp.
    // You can drop/recreate those legacy indexes in a separate migration if desired.
  },

  async down(queryInterface, Sequelize) {
    // Revert to original sizes (ONLY if you’re sure no encrypted data remains)
    await queryInterface.changeColumn(TABLE, 'email', {
      type: Sequelize.STRING(65),
      allowNull: false
    });

    await queryInterface.changeColumn(TABLE, 'google_user_id', {
      type: Sequelize.STRING(255),
      allowNull: false
    });

    await queryInterface.changeColumn(TABLE, 'phone', {
      type: Sequelize.STRING(20),
      allowNull: true
    });
  }
};
