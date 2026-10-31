const mongoose = require('mongoose');

const GroContactSchema = new mongoose.Schema({
  insurer_name: {
    type: String,
    required: true,
    unique: true,
  },
  aliases: [{
    type: String,
  }],
  email: {
    type: String,
    required: true,
  },
  toll_free: {
    type: String,
  },
  escalation_portal: {
    type: String,
  },
  ombudsman_jurisdiction: {
    type: String,
  },
  gro_name: {
    type: String,
  },
  office_address: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('GroContact', GroContactSchema);

