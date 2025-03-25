const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// Define the schema
const depositTransactionSchema = new mongoose.Schema({
  reference_number: { type: String, required: true, unique: false },
  cr: {
          type: mongoose.Schema.Types.Decimal128,
          default: 0.00,
          get: (value) => parseFloat(value.toString()),
          set: (value) => mongoose.Types.Decimal128.fromString(value.toFixed(2))
  },
  dr: {
          type: mongoose.Schema.Types.Decimal128,
          default: 0.00,
          get: (value) => parseFloat(value.toString()),
          set: (value) => mongoose.Types.Decimal128.fromString(value.toFixed(2))
  },
  running_balance: {
          type: mongoose.Schema.Types.Decimal128,
          default: 0.00,
          get: (value) => parseFloat(value.toString()),
          set: (value) => mongoose.Types.Decimal128.fromString(value.toFixed(2))
  },
  particular: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_archived: { type: Number, default: 0 }
});

// Add pagination plugin
depositTransactionSchema.plugin(mongoosePaginate);

// Create the model
const DepositTransaction = mongoose.model('tbl_deposit_transaction', depositTransactionSchema);

module.exports = DepositTransaction;
