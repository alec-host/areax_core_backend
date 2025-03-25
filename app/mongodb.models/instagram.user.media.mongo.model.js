const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  reference_number: { type: String, required: true, unique: false },
  user_id: {type: String, required: false},	
  id: { type: String, required: true },
  media_type: { type: String, required: true },
  media_url: { type: String, required: true },
  caption: { type: String, required: false },
  like_count: { type: Number, default: 0 },
  comments_count: { type: Number, default: 0 },
  permalink: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_minted: { type: Number, default: 0 },
  is_deleted: { type: Number, default: 0 }	
});

const InstagramMediaModel = mongoose.model('tbl_instagram_medias', mediaSchema);

module.exports = InstagramMediaModel;
