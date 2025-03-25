const InstagramUserDataModel = require("./instagram.user.data.mongo.model");
const InstagramTokenModel = require("./instagram.long.lived.token.mongo.model");
const InstagramMediaModel = require('./instagram.user.media.mongo.model');
const UserWalletTransaction = require('./account.wallet.transaction.model');
const TikTokTokenModel = require('./tiktok.access.token.mongo.model');
const UserLocationModel = require('./user.location.mongo.model');
const TikTokPersonDataModel = require('./tiktok.user.data.mongo.model');
const TikTokMediaModel = require('./tiktok.user.media.mongo.model');
const UtiliyTransaction = require('./account.utility.transaction.model');
const DepositTransaction = require('./account.deposit.transaction.model');
const SystemErrorsModel = require('./system.error.mongo.model');
const UserActivitiesModel = require('./user.activity.mongo.model');
const ReceiptDataModel = require('./receipt.mongo.model');

module.exports = { 
	InstagramUserDataModel,
	InstagramTokenModel,
	InstagramMediaModel,
	UserWalletTransaction,
	TikTokTokenModel,
	UserLocationModel,
	TikTokPersonDataModel,
	TikTokMediaModel,
	UtiliyTransaction,
	DepositTransaction,
	SystemErrorsModel,
	UserActivitiesModel,
	ReceiptDataModel 
};
