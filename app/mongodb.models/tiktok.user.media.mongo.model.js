const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  reference_number: { type: String, required: true, unique: false },
  user_id: {type: String, required: false},
  publish_id: { type: String, required: true },
  upload_url: { type: String, required: true },
  title: { type: String, required: false},	
  caption: { type: String, required: false },
  like_count: { type: Number, default: 0 },
  comments_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_minted: { type: Number, default: 0 },
  is_deleted: { type: Number, default: 0 }
});

const TikTokMediaModel = mongoose.model('tbl_tiktok_medias', mediaSchema);

module.exports = TikTokMediaModel;
