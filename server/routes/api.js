const express = require('express');
const multer = require('multer');
const router = express.Router();

const { analyzeRejection } = require('../controllers/auditController');
const { searchPrecedents } = require('../controllers/vectorController');
const { generateAppeal, generateOmbudsmanComplaint } = require('../controllers/appealController');
const { dispatchGro, getCaseStatus, getGroDirectory, getOmbudsmanDirectory } = require('../controllers/dispatchController');
const { MODEL_ID, EMBEDDING_MODEL_ID } = require('../config/gemini');

// In-Memory Multer storage: ephemeral upload processing per AGENT.md Hard Rule 7
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents and image files (PNG, JPG, WEBP) are supported.'));
    }
  },
});

// REST Endpoints
router.post('/analyze-rejection', upload.single('rejectionFile'), analyzeRejection);
router.post('/search-precedents', searchPrecedents);
router.post('/generate-appeal', generateAppeal);
router.post('/generate-ombudsman-complaint', generateOmbudsmanComplaint);
router.post('/dispatch-gro', dispatchGro);
router.get('/case-status/:claimId', getCaseStatus);
router.get('/gro-directory', getGroDirectory);
router.get('/ombudsman-directory', getOmbudsmanDirectory);

// Health check and system gate telemetry
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

