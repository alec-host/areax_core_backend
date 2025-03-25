const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');

const userlocationSchema = new mongoose.Schema({
  reference_number: { type: String, required: true, unique: true },
  lat: { type: String, required: true },
  lng: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
});

userlocationSchema.plugin(mongoosePaginate);

const UserLocationModel = mongoose.model('tbl_user_location', userlocationSchema);

module.exports = UserLocationModel;
