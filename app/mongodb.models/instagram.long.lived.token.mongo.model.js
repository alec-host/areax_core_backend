const mongoose = require('mongoose');

const longLivedTokenSchema = new mongoose.Schema({
  reference_number: { type: String, required: true, unique: true },
  access_token: { type: String, required: true },
  long_lived_token: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },	
});

const InstagramTokenModel = mongoose.model('tbl_instagram_tokens', longLivedTokenSchema);

module.exports = InstagramTokenModel;
