const mongoose = require('mongoose');

const RuleSetSchema = new mongoose.Schema({
  statute_name: {
    type: String,
    required: true,
  },
  rule_number: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  rule_type: {
    type: String,
    enum: ['LIMITATION', 'BAR', 'CAP', 'GROUND', 'MORATORIUM'],
    required: true,
  },
  statutory_text: {
    type: String,
    required: true,
  },
  numeric_limit: {
    type: Number,
  }
}, { timestamps: true });

module.exports = mongoose.model('RuleSet', RuleSetSchema);

