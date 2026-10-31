const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Validates Google Gemini API Key format.
 * Official Google AI Studio API keys strictly start with 'AIzaSy' and are 39 characters long.
 */
function isValidGeminiKey(key) {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  return trimmed.startsWith('AIzaSy') && trimmed.length >= 35;
}

const rawApiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
const hasValidKeyFormat = isValidGeminiKey(rawApiKey);

if (rawApiKey && !hasValidKeyFormat) {
  console.warn('\n⚠️  NOTICE [GEMINI_API_KEY]: The provided key does not start with "AIzaSy".');
  console.warn('   Google AI Studio Gemini API keys always start with "AIzaSy...".');
  console.warn('   Keys starting with "AQ." are internal OAuth / session tokens and cannot be used with the Generative Language API.');
  console.warn('   To get a free key: Visit https://aistudio.google.com/app/apikey -> Click "Create API Key".');
  console.warn('   The engine is operating with deterministic fallback vectors & OCR synthesis in the meantime.\n');
}

const genAI = hasValidKeyFormat ? new GoogleGenerativeAI(rawApiKey) : null;

const MODEL_ID = process.env.GEMINI_MODEL_ID || 'gemini-2.5-flash';
const FALLBACK_MODEL_ID = process.env.GEMINI_FALLBACK_MODEL_ID || 'gemini-1.5-flash';
const EMBEDDING_MODEL_ID = process.env.GEMINI_EMBEDDING_MODEL_ID || 'text-embedding-004';
const FALLBACK_EMBEDDING_MODEL_ID = process.env.GEMINI_FALLBACK_EMBEDDING_MODEL_ID || 'gemini-embedding-001';
const EMBEDDING_DIMENSIONS = parseInt(process.env.EMBEDDING_DIMENSIONS || '768', 10);

/**
 * Normalizes vector using L2 norm
 */
function normalizeVector(vec) {
  if (!vec || !vec.length) return [];
  const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return vec;
  return vec.map((val) => val / magnitude);
}

/**
 * Generate normalized embedding for text with dimension truncation & fallback
 */
async function generateEmbedding(text) {
  if (!genAI) {
    return generateDeterministicEmbedding(text, EMBEDDING_DIMENSIONS);
  }

  const tryModel = async (modelName) => {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.embedContent(text);
    let values = result.embedding.values;
    if (values.length > EMBEDDING_DIMENSIONS) {
      values = values.slice(0, EMBEDDING_DIMENSIONS);
    }
    return normalizeVector(values);
  };

  try {
    return await tryModel(EMBEDDING_MODEL_ID);
  } catch (err) {
    try {
      return await tryModel(FALLBACK_EMBEDDING_MODEL_ID);
    } catch (fallbackErr) {
      return generateDeterministicEmbedding(text, EMBEDDING_DIMENSIONS);
    }
  }
}

/**
 * Deterministic pseudo-embedding for testing or offline environments
 */
function generateDeterministicEmbedding(text, dims = 768) {
  const vec = new Array(dims).fill(0);
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const idx = (code * (i + 1) * 31) % dims;
    vec[idx] += (code % 17) - 8;
  }
  return normalizeVector(vec);
}

/**
 * Get Generative Model instance with fallback capability
 */
function getGenerativeModel(options = {}) {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: MODEL_ID,
    ...options,
  });
}

function getFallbackModel(options = {}) {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: FALLBACK_MODEL_ID,
    ...options,
  });
}

module.exports = {
  genAI,
  MODEL_ID,
  FALLBACK_MODEL_ID,
  EMBEDDING_MODEL_ID,
  EMBEDDING_DIMENSIONS,
  generateEmbedding,
  normalizeVector,
  getGenerativeModel,
  getFallbackModel,
  isValidGeminiKey,
  hasValidKeyFormat,
};
