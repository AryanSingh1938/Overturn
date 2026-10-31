/**
 * =================================================================================================
 * OVERTURN CIVIC ENGINE — CENTRAL API ROUTER (routes/api.js)
 * =================================================================================================
 *
 * 1. FILE PURPOSE & ROLE:
 *    This file defines the RESTful HTTP route mappings for the core Overturn civic appeal engine.
 *    It connects incoming HTTP requests to their specialized backend controllers:
 *    rejection letter audit, vector precedent retrieval, legal appeal generation, Ombudsman Form VI
 *    escalation, GRO dispatch, and directory lookups.
 *
 * 2. WHY THIS FILE IS CRITICAL IN THE PIPELINE:
 *    It enforces the single-responsibility principle: routing declarations live in one clean table,
 *    while algorithmic processing, LLM synthesis, and database operations are delegated to their
 *    respective controllers. It also implements in-memory Multer file handling for zero-disk privacy.
 *
 * 3. WORKFLOW PIPELINE MAPPING:
 *    Step 1: POST /analyze-rejection            ──► In-memory OCR & Zod extraction (auditController)
 *    Step 2: POST /search-precedents            ──► 768-dim Atlas Vector search (vectorController)
 *    Step 3: POST /generate-appeal              ──► Grounded legal representation (appealController)
 *    Step 4: POST /dispatch-gro                 ──► 1-Click Mailto & SMTP Dispatch (dispatchController)
 *    Step 5: GET  /case-status/:claimId         ──► 30-Day countdown tracking (dispatchController)
 *    Step 6: POST /generate-ombudsman-complaint ──► Day-31 Form VI Escalation Package (appealController)
 *    Step 7: GET  /gro-directory                ──► Insurer GRO contact directory (dispatchController)
 *    Step 8: GET  /ombudsman-directory          ──► 18 Regional Ombudsman Benches (dispatchController)
 *
 * 4. IMPORTED MODULES & WHY THEY ARE CRITICAL:
 *    - `express.Router()`: Creates modular, mountable route handlers.
 *    - `multer`: In-memory multipart/form-data handler for PDF and image document uploads.
 *    - `auditController`: Multimodal OCR vision & fact extraction.
 *    - `vectorController`: 768-dim normalized embedding and Atlas Vector search.
 *    - `appealController`: Grounded legal appeal drafting & Ombudsman Form VI complaint generator.
 *    - `dispatchController`: Human-in-the-loop dispatch, tracking token issuer, and contact directories.
 *    - `gemini config`: Telemetry export for active model IDs and dimensions.
 * =================================================================================================
 */

const express = require('express');
const multer = require('multer');
const router = express.Router();

// Controllers powering the decoupled civic appeal pipeline
const { analyzeRejection } = require('../controllers/auditController');
const { searchPrecedents } = require('../controllers/vectorController');
const { generateAppeal, generateOmbudsmanComplaint } = require('../controllers/appealController');
const { dispatchGro, getCaseStatus, getUserCases, getGroDirectory, getOmbudsmanDirectory } = require('../controllers/dispatchController');
const { MODEL_ID, EMBEDDING_MODEL_ID } = require('../config/gemini');

// =================================================================================================
// PRIVACY ARCHITECTURE: EPHEMERAL IN-MEMORY FILE UPLOAD (AGENT.md Rule 7)
// Uploaded repudiation letters (PDF, PNG, JPG, WEBP) are buffered strictly in RAM (memoryStorage).
// No user document is ever written to physical disk, preventing local file leakage.
// =================================================================================================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum file size limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept standard image formats and PDF documents
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Only PDF documents and image files (PNG, JPG, WEBP) are supported.'));
    }
  },
});

// =================================================================================================
// REST API ENDPOINT DECLARATIONS
// =================================================================================================

/**
 * @route   POST /api/v1/analyze-rejection
 * @desc    Accepts an uploaded repudiation document (or JSON payload), executes multimodal OCR,
 *          extracts structured facts (insurer, policy age, denial clause, amount), and evaluates
 *          deterministic statutory limitation deadlines and IRDAI 60-month moratorium rules.
 * @access  Public
 */
router.post('/analyze-rejection', upload.single('rejectionFile'), analyzeRejection);

/**
 * @route   POST /api/v1/search-precedents
 * @desc    Converts the repudiation ground text into a 768-dimensional normalized embedding vector
 *          and performs MongoDB Atlas $vectorSearch across authentic Supreme Court and High Court judgments.
 * @access  Public
 */
router.post('/search-precedents', searchPrecedents);

/**
 * @route   POST /api/v1/generate-appeal
 * @desc    Synthesizes a court-ready legal representation addressed to the insurer's GRO under Rule 14(3).
 *          Enforces the Programmatic Citation Verifier: any hallucinated citation triggers automatic
 *          guardrail fallback to the authentic deterministic legal representation.
 * @access  Public
 */
router.post('/generate-appeal', generateAppeal);

/**
 * @route   POST /api/v1/generate-ombudsman-complaint
 * @desc    Generates the statutory Form VI Complaint to the Insurance Ombudsman under Rule 14(1)
 *          when the mandatory 30-day GRO cure window elapses. Automatically resolves the territorial
 *          Ombudsman bench across India's 18 regional offices based on the user's state.
 * @access  Public
 */
router.post('/generate-ombudsman-complaint', generateOmbudsmanComplaint);

/**
 * @route   POST /api/v1/dispatch-gro
 * @desc    Enforces human-in-the-loop confirmation before dispatch. Generates a 1-click native mailto URI
 *          for policyholder email privity, sets Reply-To via SMTP, issues an audit tracking token (OT-2026-XXXXXX),
 *          and initializes the 30-day statutory countdown timer.
 * @access  Public
 */
router.post('/dispatch-gro', dispatchGro);

/**
 * @route   GET /api/v1/case-status/:claimId
 * @desc    Retrieves live case status, tracking token details, days remaining in the 30-day statutory
 *          cure window, and milestone completion flags from memory or MongoDB.
 * @access  Public
 */
router.get('/case-status/:claimId', getCaseStatus);

/**
 * @route   GET /api/v1/my-claims
 * @desc    Retrieves all dispute records belonging to a user (by ?email=... or ?userId=...).
 *          Powers the user dashboard so policyholders see all their cases in one place.
 * @access  Public
 */
router.get('/my-claims', getUserCases);

/**
 * @route   GET /api/v1/gro-directory
 * @desc    Returns the verified directory of insurer Grievance Redressal Officers (emails, toll-free, portals).
 * @access  Public
 */
router.get('/gro-directory', getGroDirectory);

/**
 * @route   GET /api/v1/ombudsman-directory
 * @desc    Returns all 18 regional Insurance Ombudsman Benches across India with email, address, and jurisdictions.
 * @access  Public
 */
router.get('/ombudsman-directory', getOmbudsmanDirectory);

/**
 * @route   GET /api/v1/health
 * @desc    System health check and diagnostic telemetry endpoint reporting AI model status,
 *          database connectivity, and statutory legal disclaimers.
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'Overturn API Service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    ai_runtime: {
      model_id: MODEL_ID,
      embedding_model_id: EMBEDDING_MODEL_ID,
      api_key_configured: Boolean(process.env.GEMINI_API_KEY),
    },
    database: {
      connected: Boolean(require('mongoose').connection.readyState === 1),
    },
    statutory_disclaimer: 'Overturn is an automated procedural assistance platform, not a licensed legal practitioner or law firm, and does not provide formal legal advice.',
  });
});

module.exports = router;
