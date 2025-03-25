const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');

const systemErrorsSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },	
  reference_number: { type: String, required: true, index: true },
  error_code: { type: String, required: true },
  error_message: { type: String, required: true },
  time_stamp: { type: Date, default: Date.now },
  is_archived: { type: Number, default: 0 }
});

systemErrorsSchema.plugin(mongoosePaginate);

const SystemErrorsModel = mongoose.model('tbl_system_logs', systemErrorsSchema);

module.exports = SystemErrorsModel;
