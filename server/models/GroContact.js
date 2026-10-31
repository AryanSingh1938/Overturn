/**
 * =================================================================================================
 * OVERTURN MONGOOSE MODEL — INSURER GRO DIRECTORY (models/GroContact.js)
 * =================================================================================================
 *
 * 1. FILE PURPOSE & ROLE:
 *    Defines the Mongoose schema and model for storing authentic Grievance Redressal Officer (GRO)
 *    contacts for Indian life, general, and standalone health insurance companies.
 *    Sourced directly from the official IRDAI Bima Bharosa portal.
 *
 * 2. WHY THIS FILE IS CRITICAL IN THE PIPELINE:
 *    When an appeal representation is finalized, the system queries this collection by insurer name
 *    or alias (e.g. "Star Health" or "Care") to automatically resolve the verified compliance email,
 *    toll-free escalation number, and official grievance escalation portal.
 *
 * 3. SCHEMA FIELDS:
 *    - `insurer_name`: Legal registered name of insurance company
 *    - `aliases`: Common acronyms or variations (e.g. ["Star Health", "Star Allied"])
 *    - `email`: Official compliance email address of the Grievance Redressal Officer
 *    - `toll_free`: Toll-free customer grievance helpline
 *    - `escalation_portal`: Official web URL for digital grievance filing
 *    - `ombudsman_jurisdiction`: Default regional Ombudsman bench
 *    - `gro_name` & `office_address`: Officer in-charge details
 * =================================================================================================
 */

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
  },
}, { timestamps: true });

module.exports = mongoose.model('GroContact', GroContactSchema);
