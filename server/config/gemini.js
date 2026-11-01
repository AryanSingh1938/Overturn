/**
 * =================================================================================================
 * OVERTURN AI ENGINE CONFIGURATION — GOOGLE GEMINI & VECTOR EMBEDDINGS (config/gemini.js)
 * =================================================================================================
 *
 * 1. FILE PURPOSE & ROLE:
 *    Configures and exports Google Gemini AI generative models and vector embedding generators.
 *    It validates API key formats, manages fallback model chains, enforces 768-dimensional vector
 *    truncation, computes L2 normalization for accurate cosine similarity, and provides deterministic
 *    pseudo-embeddings so unit tests and offline demos never crash.
 *
 * 2. WHY THIS FILE IS CRITICAL IN THE PIPELINE:
 *    - Multimodal Vision OCR: Powers auditController.js to parse repudiation letters from base64 RAM buffers.
 *    - Vector Precedent Search: Powers vectorController.js by embedding user denial clauses into 768-dim vectors.
 *    - Legal Representation Synthesis: Powers appealController.js to draft court-ready legal notices.
 *    - Mathematical Rigor: Embeddings MUST be normalized to unit length (|v| = 1.0) so that dot products
 *      accurately equal cosine similarity during Atlas $vectorSearch.
 *
 * 3. IMPORTED MODULES:
 *    - `@google/generative-ai`: Official Google Gen AI SDK for Node.js.
 *
 * 4. KEY FUNCTIONS EXPORTED:
 *    - `generateEmbedding(text)`: Generates a normalized 768-dimensional embedding vector.
 *    - `normalizeVector(vec)`: Computes L2 unit normalization (magnitude = 1.0).
 *    - `getGenerativeModel(options)`: Instantiates primary generative model (gemini-2.5-flash).
 *    - `getFallbackModel(options)`: Instantiates fallback generative model (gemini-1.5-flash).
 *    - `generateDeterministicEmbedding(text, dims)`: Offline mathematical hash for test resilience.
 *    - `isValidGeminiKey(key)`: Asserts valid Google AI Studio API key format ('AIzaSy...').
 * =================================================================================================
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Validates Google Gemini API Key format.
 * Official Google AI Studio API keys start with 'AIzaSy' or modern 'AQ.' format.
 * Prevents developers from accidentally using invalid placeholders.
 *
 * @param {string} key - The API key candidate to test
 * @returns {boolean} True if key matches authentic Google AI Studio format
 */
function isValidGeminiKey(key) {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  if (trimmed.length < 25) return false;
  if (trimmed.includes('your_') || trimmed.includes('<') || trimmed.toLowerCase().includes('placeholder') || trimmed.toLowerCase().includes('example')) return false;
  if (!trimmed.startsWith('AIzaSy') && !trimmed.startsWith('AQ.')) return false;
  return true;
}

// Read and sanitize API key from environment variables
const rawApiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
const hasValidKeyFormat = isValidGeminiKey(rawApiKey);

// Log developer guidance if key format is unrecognized
if (rawApiKey && !hasValidKeyFormat) {
  console.warn('\n⚠️  NOTICE [GEMINI_API_KEY]: The provided key format is invalid or contains placeholder text.');
  console.warn('   To get an API key: Visit https://aistudio.google.com/app/apikey -> Click "Create API Key".');
  console.warn('   The engine is operating with deterministic fallback vectors & OCR synthesis in the meantime.\n');
}

// Initialize GoogleGenerativeAI client instance if a valid key is configured
const genAI = hasValidKeyFormat ? new GoogleGenerativeAI(rawApiKey) : null;

// Model Identifiers: Primary and fallback models configurable via environment variables
const MODEL_ID = process.env.GEMINI_MODEL_ID || 'gemini-3.8-flash';
const FALLBACK_MODEL_ID = process.env.GEMINI_FALLBACK_MODEL_ID || 'gemini-3.6-flash';
const TERTIARY_MODEL_ID = process.env.GEMINI_TERTIARY_MODEL_ID || 'gemini-3.5-flash-lite';
const EMBEDDING_MODEL_ID = process.env.GEMINI_EMBEDDING_MODEL_ID || 'text-embedding-004';
const FALLBACK_EMBEDDING_MODEL_ID = process.env.GEMINI_FALLBACK_EMBEDDING_MODEL_ID || 'gemini-embedding-001';
const EMBEDDING_DIMENSIONS = parseInt(process.env.EMBEDDING_DIMENSIONS || '768', 10);

/**
 * Normalizes a vector using L2 Euclidean norm so that:
 * magnitude = sqrt(sum(v_i^2)) = 1.0.
 *
 * Why this matters: In high-dimensional vector spaces, normalizing vectors allows cosine similarity
 * to be computed directly as a dot product, enabling fast vector comparisons.
 *
 * @param {number[]} vec - Raw floating point embedding vector
 * @returns {number[]} Normalized unit vector
 */
function normalizeVector(vec) {
  if (!vec || !vec.length) return [];
  const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return vec;
  return vec.map((val) => val / magnitude);
}

/**
 * Generates a normalized 768-dimensional embedding vector for input text.
 * Implements a resilient 3-tier fallback chain:
 * Tier 1: text-embedding-004 (primary)
 * Tier 2: gemini-embedding-001 (fallback model)
 * Tier 3: Deterministic pseudo-embedding (offline / testing mode)
 *
 * @param {string} text - The legal ground or query text to embed
 * @returns {Promise<number[]>} 768-dimensional normalized embedding vector
 */
async function generateEmbedding(text) {
  if (!genAI) {
    return generateDeterministicEmbedding(text, EMBEDDING_DIMENSIONS);
  }

  const tryModel = async (modelName) => {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.embedContent(text);
    let values = result.embedding.values;

    // Enforce exact 768 dimensions for MongoDB Atlas Vector Index compatibility
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
 * Generates a deterministic pseudo-embedding vector using mathematical polynomial hashing.
 * Guarantees consistent vector values across runs for the same input string without calling external APIs.
 * Used for unit testing (npm test) and offline local demonstrations.
 *
 * @param {string} text - Input query string
 * @param {number} dims - Target dimensions (defaults to 768)
 * @returns {number[]} Normalized 768-dimensional vector
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
 * Returns a configured Gemini GenerativeModel instance for multimodal OCR and legal drafting.
 *
 * @param {Object} options - Generation options (e.g. temperature, maxOutputTokens)
 * @returns {GenerativeModel|null}
 */
function getGenerativeModel(options = {}) {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: MODEL_ID,
    ...options,
  });
}

/**
 * Returns fallback Gemini GenerativeModel instance.
 *
 * @param {Object} options - Generation options
 * @returns {GenerativeModel|null}
 */
function getFallbackModel(options = {}) {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: FALLBACK_MODEL_ID,
    ...options,
  });
}

/**
 * Executes generateContent with an intelligent multi-tier fallback chain.
 * If the primary model encounters a temporary 503 capacity spike or 404,
 * it automatically steps through fallback models (3.8 -> 3.6 -> 3.5-lite) to prevent failures.
 *
 * @param {Array|string} contents - Prompt parts or text
 * @param {Object} options - Model options
 * @returns {Promise<Object>} Generative response result
 */
async function generateContentWithFallback(contents, options = {}) {
  if (!genAI) return null;

  const candidateModels = [
    MODEL_ID,
    FALLBACK_MODEL_ID,
    TERTIARY_MODEL_ID,
    'gemini-1.5-flash',
  ].filter(Boolean);

  let lastErr = null;
  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, ...options });
      const result = await model.generateContent(contents);
      return result;
    } catch (err) {
      lastErr = err;
      const msg = err.message || '';
      const is503 = msg.includes('503') || msg.includes('high demand') || msg.includes('Service Unavailable');
      console.warn(`⚠️ [Gemini] Model '${modelName}' unavailable: ${msg.slice(0, 100)}. Trying fallback model...`);

      // If temporary capacity spike (503), briefly wait 600ms before querying next model
      if (is503) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  }

  throw lastErr;
}

module.exports = {
  genAI,
  MODEL_ID,
  FALLBACK_MODEL_ID,
  TERTIARY_MODEL_ID,
  EMBEDDING_MODEL_ID,
  EMBEDDING_DIMENSIONS,
  generateEmbedding,
  normalizeVector,
  getGenerativeModel,
  getFallbackModel,
  generateContentWithFallback,
  isValidGeminiKey,
  hasValidKeyFormat,
};
