/**
 * =================================================================================================
 * OVERTURN MONGOOSE MODEL — JUDICIAL PRECEDENT & VECTOR EMBEDDING (models/Precedent.js)
 * =================================================================================================
 *
 * 1. FILE PURPOSE & ROLE:
 *    Defines the Mongoose schema and model for storing authentic Indian Supreme Court and High Court
 *    precedent chunks in MongoDB Atlas. Each document contains case metadata, legal grounds, verbatim
 *    ruling excerpts, and a 768-dimensional normalized vector embedding.
 *
 * 2. WHY THIS FILE IS CRITICAL IN THE PIPELINE:
 *    This schema powers the MongoDB Atlas Vector Search index (`precedent_vector_index`).
 *    When a user's denial reason is vectorized, MongoDB Atlas searches across the `embedding` field
 *    defined here to return the most relevant landmark judgments in sub-50ms query time.
 *
 * 3. SCHEMA FIELDS:
 *    - `dataset`: 'supreme_court' | 'high_court'
 *    - `court`: Full court name (e.g. "Supreme Court of India", "Delhi High Court")
 *    - `case_id`: Official appeal citation (e.g. "Civil Appeal No. 4092 of 2022")
 *    - `case_name`: Official case title (e.g. "Manmohan Nanda v. United India Assurance Co. Ltd.")
 *    - `judgment_date` & `year`: Date and calendar year of judgment
 *    - `source_s3_key`: Public S3 URI in the Indian eCourts judgment corpus
 *    - `chunk_text`: Verbatim judicial holding text used for grounding
 *    - `grounds`: Indexed legal tags (e.g. ["pre_existing_disease", "repudiation", "moratorium"])
 *    - `embedding`: 768-dimensional L2-normalized floating point vector array
 * =================================================================================================
 */

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
    type: [Number], // 768-dimensional normalized vector for Atlas $vectorSearch
    required: true,
  },
}, { timestamps: true });

// Standard text index for keyword backup search when vector index is initializing
PrecedentChunkSchema.index({ case_name: 'text', chunk_text: 'text', grounds: 'text' });

module.exports = mongoose.model('PrecedentChunk', PrecedentChunkSchema);
