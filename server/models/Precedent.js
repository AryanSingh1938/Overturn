const mongoose = require('mongoose');

const PrecedentChunkSchema = new mongoose.Schema({
  dataset: {
    type: String,
    enum: ['supreme_court', 'high_court'],
    required: true,
    default: 'supreme_court',
  },
  court: {
    type: String,
    required: true,
  },
  case_id: {
    type: String,
    required: true,
  },
  case_name: {
    type: String,
    required: true,
  },
  judgment_date: {
    type: Date,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  source_s3_key: {
    type: String,
    required: true,
  },
  chunk_text: {
    type: String,
    required: true,
  },
  grounds: [{
    type: String,
  }],
  public_url: {
    type: String,
  },
  embedding: {
    type: [Number],
    required: true,
  },
}, { timestamps: true });

// Standard text index for keyword backup search
PrecedentChunkSchema.index({ case_name: 'text', chunk_text: 'text', case_id: 'text' });

module.exports = mongoose.model('PrecedentChunk', PrecedentChunkSchema);

