const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');

const userActivitiesSchema = new mongoose.Schema({ 
   email: { type: String, required: true, index: true },
   reference_number: { type: String, required: true, index: true },
   activity_name: { type: String, required: true },
   time_stamp: { type: Date, default: Date.now }, 
   is_archived: { type: Number, default: 0 } 
}); 

userActivitiesSchema.plugin(mongoosePaginate);

const UserActivitiesModel = mongoose.model('tbl_user_activities', userActivitiesSchema);

module.exports = UserActivitiesModel;
