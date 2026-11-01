/**
 * =================================================================================================
 * OVERTURN SECURITY CONFIGURATION — ENVIRONMENT VARIABLE AUDITOR (config/validateEnv.js)
 * =================================================================================================
 * Validates system environment configuration at boot time, catching:
 * - Insecure fallback secrets in production
 * - Missing required runtime variables
 * - Weak cryptographic keys (< 32 characters)
 * - Placeholder database URIs
 * =================================================================================================
 */

const KNOWN_INSECURE_SECRETS = [
  'overturn_super_secret_jwt_key_2026_secure',
  'e749ea4ea43190a524ba65d62ef995ee',
  'your_jwt_secret_key_minimum_32_characters_here',
  'secret',
  'jwt_secret',
  'changeme',
];

function validateEnvironment() {
  const isProduction = process.env.NODE_ENV === 'production';
  const warnings = [];
  const errors = [];

  // 1. Validate JWT_SECRET
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    if (isProduction) {
      errors.push('CRITICAL: JWT_SECRET environment variable is missing in production.');
    } else {
      warnings.push('NOTICE: JWT_SECRET not set. Falling back to development secret.');
    }
  } else {
    if (KNOWN_INSECURE_SECRETS.includes(jwtSecret.trim())) {
      if (isProduction) {
        errors.push('CRITICAL: JWT_SECRET uses a known default or committed placeholder. Replace immediately.');
      } else {
        warnings.push('NOTICE: JWT_SECRET is using a known development secret. Change before deploying to production.');
      }
    }
    if (jwtSecret.trim().length < 32) {
      warnings.push('SECURITY: JWT_SECRET is shorter than 32 characters. Consider generating a 256-bit secret.');
    }
  }

  // 2. Validate MONGODB_URI
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    if (mongoUri.includes('<password>') || mongoUri.includes('<db_password>')) {
      warnings.push('DATABASE: MONGODB_URI contains placeholder credentials.');
    }
  }

  // 3. Output Auditing Diagnostics
  if (warnings.length > 0 && !isProduction) {
    console.log('\n🔒 [Security Audit: Environment]');
    warnings.forEach((w) => console.warn(`   ⚠️  ${w}`));
    console.log('');
  }

  if (errors.length > 0) {
    console.error('\n❌ [Security Gate Failure: Environment Configuration]');
    errors.forEach((e) => console.error(`   🛑 ${e}`));
    console.error('');
    if (isProduction) {
      throw new Error(`Production environment configuration failed: ${errors.join('; ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

module.exports = {
  validateEnvironment,
  KNOWN_INSECURE_SECRETS,
};
