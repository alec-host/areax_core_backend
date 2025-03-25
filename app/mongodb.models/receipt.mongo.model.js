const mongoose = require('mongoose');
const lineItemSchema = new mongoose.Schema({
  item_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total_price: { type: Number, required: true }	
});
const receiptDataSchema = new mongoose.Schema({
  email: { type: String, required: true }, 	
  reference_number: { type: String, required: true },
  business_name: { type: String, required: false },
  business_address: { type: String, required: false },
  contact_information: { type: String, required: false },
  receipt_number: { type: String, required: true },
  date: { type: Date, default: Date.now },	
  customer_name: { type: String, required: true },
  line_item: [lineItemSchema],	
  sub_total: { type: Number, required: true },
  taxes: { type: Number, required: true },
  total_amount: { type: Number, required: false },
  payment_method: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_deleted: { type: Number, default: 0 }
});

const ReceiptDataModel = mongoose.model('tbl_receipt', receiptDataSchema);

module.exports = ReceiptDataModel;
