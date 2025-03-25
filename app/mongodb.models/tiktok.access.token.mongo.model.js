const mongoose = require('mongoose');

const tiktokAccessTokenSchema = new mongoose.Schema({
  reference_number: { type: String, required: true, unique: true },
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  open_id: { type: String, required: false },
  scope: { type: String, required: false },	
  expires_in: { type: String, required: true }	
});

const TikTokTokenModel = mongoose.model('tbl_tiktok_tokens', tiktokAccessTokenSchema);

module.exports = TikTokTokenModel;

