const mongoose = require('mongoose');

const instagramPersonDataSchema = new mongoose.Schema({
  reference_number: { type: String, required: true, unique: true },
  id: { type: String, required: true },
  user_id: { type: String, required: true },
  username: { type: String, required: true },
  name: { type: String, required: true },
  account_type: { type: String, required: true },
  profile_picture_url: { type: String },
  followers_count: { type: Number, default: 0 },
  follows_count: { type: Number, default: 0 },
  media_count: { type: Number },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_revoked: { type: Number, default: 0 },
  is_deleted: { type: Number, default: 0 },
});

const InstagramPersonDataModel = mongoose.model('tbl_ig_datas', instagramPersonDataSchema);

module.exports = InstagramPersonDataModel;
