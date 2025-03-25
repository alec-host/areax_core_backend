const mongoose = require('mongoose');

const tiktokPersonDataSchema = new mongoose.Schema({
  reference_number: { type: String, required: true, unique: true },
  open_id: { type: String, required: true },
  union_id: { type: String, required: true },
  avatar_url: { type: String, required: false },
  display_name: { type: String, required: true },
  profile_deep_link: { type: String, required: false },
  bio_description: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_revoked: { type: Number, default: 0 },
  is_deleted: { type: Number, default: 0 },
});

const TikTokPersonDataModel = mongoose.model('tbl_tiktok_datas', tiktokPersonDataSchema);

module.exports = TikTokPersonDataModel;
