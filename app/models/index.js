const { Sequelize,DataTypes } = require("sequelize");
const { DATABASE_DIALECT } = require("../constants/app_constants");

const dialect = DATABASE_DIALECT || 'postgres';
let sequelize1, sequelize2;

if (dialect === 'postgres') {
    console.log('Using PostgreSQL Drivers...');
    sequelize1 = require("../db/db.gres");
    sequelize2 = require("../db/db.gres2");
} else {
    sequelize1 = require("../db/db");
    sequelize2 = require("../db/db2");
}

const db = {};
const db2 = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize1;

db2.Sequelize = Sequelize;
db2.sequelize = sequelize2;

//-.database 1.
db.users = require("../models/user.model")(sequelize1,Sequelize);
db.wallets = require("../models/user.wallet.model")(sequelize1,Sequelize);
db.users.purged = require("../models/user.purged.model")(sequelize1,Sequelize);
db.users.preferences = require("./user.preference.model")(sequelize1,Sequelize);
db.users.activities = require("../models/user.activity.model")(sequelize1,Sequelize);
db.blockchains = require("../models/blockchain.wallet.model")(sequelize1,Sequelize);
db.otps = require("./otp.model")(sequelize1,Sequelize);
db.tiers = require("../models/subscription.tier.model")(sequelize1,Sequelize);
db.referrals = require("../models/referral.model")(sequelize1,Sequelize);
//-.database 2.
db2.instagrams = require("./instagram.user.data.model")(sequelize2,Sequelize);
db2.instagrams.archive = require("./user.instagram.data.archive.model")(sequelize2,Sequelize);
db2.instagrams.activities = require("./instagram.activity.log.model")(sequelize2,Sequelize);
db2.instagrams.tokens = require("./instagram.long.lived.token.model")(sequelize2,Sequelize);
db2.instagrams.media = require("./instagram.media.item.model")(sequelize2,Sequelize);
db2.instagrams.session = require("./instagram.session.model")(sequelize2,Sequelize);
//-.parallel PG models for MongoDB compatibility
db2.pg_user_locations = require("../mongodb.models/user.location.pg.model")(sequelize2, Sequelize);
db2.pg_ig_user_data = require("../mongodb.models/instagram.user.data.pg.model")(sequelize2, Sequelize);
db2.pg_ig_tokens = require("../mongodb.models/instagram.long.lived.token.pg.model")(sequelize2, Sequelize);
//console.log('DEBUG: db.pg_ig_tokens initialized:', !!db2.pg_ig_tokens, db);
db2.pg_ig_media = require("../mongodb.models/instagram.user.media.pg.model")(sequelize2, Sequelize);
db2.pg_wallet_transactions = require("../mongodb.models/account.wallet.transaction.pg.model")(sequelize2, Sequelize);
db2.pg_deposit_transactions = require("../mongodb.models/account.deposit.transaction.pg.model")(sequelize2, Sequelize);
db2.pg_tiktok_tokens = require("../mongodb.models/tiktok.access.token.pg.model")(sequelize2, Sequelize);
db2.pg_user_activities = require("../mongodb.models/user.activity.pg.model")(sequelize2, Sequelize);
db2.pg_tiktok_user_data = require("../mongodb.models/tiktok.user.data.pg.model")(sequelize2, Sequelize);
db2.pg_system_errors = require("../mongodb.models/system.error.pg.model")(sequelize2, Sequelize);
db2.pg_tiktok_media = require("../mongodb.models/tiktok.user.media.pg.model")(sequelize2, Sequelize);
db2.pg_utility_transactions = require("../mongodb.models/account.utility.transaction.pg.model")(sequelize2, Sequelize);
db2.pg_receipts = require("../mongodb.models/receipt.pg.model")(sequelize2, Sequelize);

db.wallets.belongsTo(db.users, { foreignKey: 'reference_number',targetKey: 'reference_number' });
db.users.hasOne(db.wallets, { foreignKey: 'reference_number' ,sourceKey: 'reference_number' });

module.exports = {db,db2};
