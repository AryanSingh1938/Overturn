/**
 * ============================================================================
 * PROJECT OVERTURN | GATE 1 (G1) SYSTEM & ENVIRONMENT VERIFIER
 * ============================================================================
 * 
 * PURPOSE:
 * Pre-flight diagnostic tool. Run this before coding and 5 minutes before
 * presenting to hackathon judges.
 * 
 * SPECIFIED CHECKS & ERROR CODES:
 * 1. [ERR_ENV_MISSING / ERR_ENV_PLACEHOLDER] -> API keys & environment variables
 * 2. [ERR_FILE_NOT_FOUND / ERR_JSON_SYNTAX]   -> Corrupted or missing data files
 * 3. [ERR_MONGO_TIMEOUT / ERR_MONGO_AUTH / ERR_MONGO_IP_BLOCKED] -> Atlas DB ping
 * 4. [ERR_GEMINI_AUTH / ERR_GEMINI_NETWORK / ERR_GEMINI_QUOTA]   -> Gemini API ping
 * 5. [ERR_VECTOR_DIMENSION_MISMATCH]         -> 768-dim normalized vector check
 * 
 * HOW TO RUN:
 * $ node scripts/verify_system.js
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Terminal ANSI formatting
const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";

console.log(`\n${BOLD}=======================================================${RESET}`);
console.log(`${BOLD} ⚖️  PROJECT OVERTURN: SYSTEM PRE-FLIGHT DIAGNOSTICS${RESET}`);
console.log(`${BOLD}=======================================================${RESET}\n`);

const issues = [];

function recordError(code, title, details, recommendedFix) {
  issues.push({ code, title, details, recommendedFix });
  console.log(`  ${RED}❌ FAIL [${code}]: ${title}${RESET}`);
  console.log(`     ${YELLOW}Reason: ${details}${RESET}`);
}

function recordPass(testName, detail = "") {
  console.log(`  ${GREEN}✓ PASS:${RESET} ${testName} ${detail ? `${CYAN}(${detail})${RESET}` : ""}`);
}

async function runAllChecks() {
  // --------------------------------------------------------------------------
  // STEP 0: CHECK IF NPM DEPENDENCIES ARE INSTALLED
  // --------------------------------------------------------------------------
  let dotenv, mongoose, GoogleGenAI;
  try {
    dotenv = await import('dotenv');
    dotenv.config();
  } catch (e) {
    // Attempt manual .env parsing if dotenv is not installed
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          process.env[key] = value.trim();
        }
      }
    }
  }

  try {
    const mongoModule = await import('mongoose');
    mongoose = mongoModule.default || mongoModule;
  } catch (e) {
    recordError(
      'ERR_DEPENDENCY_MISSING',
      'Missing Package: mongoose',
      'The "mongoose" package is not installed in the local node_modules.',
      'Run: npm install mongoose'
    );
  }

  try {
    const genaiModule = await import('@google/genai');
    GoogleGenAI = genaiModule.GoogleGenAI;
  } catch (e) {
    recordError(
      'ERR_DEPENDENCY_MISSING',
      'Missing Package: @google/genai',
      'The "@google/genai" SDK is not installed in the local node_modules.',
      'Run: npm install @google/genai'
    );
  }

  // ==========================================================================
  // CHECK 1: ARE API KEYS & ENVIRONMENT VARIABLES ACTIVE?
  // ==========================================================================
  console.log(`${BOLD}1. Checking Environment Variables & Keys...${RESET}`);
  const requiredKeys = [
    { key: 'MONGODB_URI', label: 'MongoDB Atlas Connection String' },
    { key: 'GEMINI_API_KEY', label: 'Google Gemini API Key' }
  ];

  let envOk = true;
  for (const { key, label } of requiredKeys) {
    const val = process.env[key];
    if (!val) {
      envOk = false;
      recordError(
        'ERR_ENV_MISSING',
        `Missing ${key}`,
        `${label} is not defined in your .env file.`,
        `Create a .env file in project root and add: ${key}=<your_actual_value>`
      );
    } else if (
      val.includes('your_') ||
      val.includes('<username>') ||
      val.includes('<password>') ||
      val === 'your_gemini_api_key_here'
    ) {
      envOk = false;
      recordError(
        'ERR_ENV_PLACEHOLDER',
        `Placeholder value detected in ${key}`,
        `${key} contains boilerplate placeholder text: "${val.substring(0, 25)}..."`,
        `Replace the placeholder with your actual live credentials in .env.`
      );
    }
  }

  if (envOk) {
    recordPass("Environment Variables", "MONGODB_URI and GEMINI_API_KEY present and configured");
  }

  // ==========================================================================
  // CHECK 2: ARE DATA FILES CORRUPTED OR MISSING?
  // ==========================================================================
  console.log(`\n${BOLD}2. Checking Data Files Integrity...${RESET}`);
  const dataFiles = [
    // Core Platform Data (Precedents, Rules, GROs, Samples)
    { path: '../data/precedents.json', name: 'data/precedents.json' },
    { path: '../data/rules.json', name: 'data/rules.json' },
    { path: '../data/gro_directory.json', name: 'data/gro_directory.json' },
    { path: '../data/sample_letters/samples_index.json', name: 'data/sample_letters/samples_index.json' },
    { path: '../data/sample_letters/sample_rejection_star_health.txt', name: 'data/sample_letters/sample_rejection_star_health.txt' },
    { path: '../data/sample_letters/sample_rejection_care_health.txt', name: 'data/sample_letters/sample_rejection_care_health.txt' },

    // IRDAI & Policyholder Redressal Regulations
    { path: '../data/health_insurance_rules.json', name: 'data/health_insurance_rules.json' },
    { path: '../data/irdai_insurance_products_regulations_2024.json', name: 'data/irdai_insurance_products_regulations_2024.json' },
    { path: '../data/ombudsman_amendment_2023.json', name: 'data/ombudsman_amendment_2023.json' },
    { path: '../data/ombudsman_rules.json', name: 'data/ombudsman_rules.json' },
    { path: '../data/policyholder_protection_rules.json', name: 'data/policyholder_protection_rules.json' },

    // Structured Knowledge Base (Legal, Directory, Policies, Testing)
    { path: '../data/legal/precedents.json', name: 'data/legal/precedents.json' },
    { path: '../data/legal/regulations.json', name: 'data/legal/regulations.json' },
    { path: '../data/legal/ombudsman_rules.json', name: 'data/legal/ombudsman_rules.json' },
    { path: '../data/legal/consumer_protection.json', name: 'data/legal/consumer_protection.json' },
    { path: '../data/directory/gro_directory.json', name: 'data/directory/gro_directory.json' },
    { path: '../data/directory/ombudsman_offices.json', name: 'data/directory/ombudsman_offices.json' },
    { path: '../data/policies/insurance_policies.json', name: 'data/policies/insurance_policies.json' },
    { path: '../data/testing/sample_letters.json', name: 'data/testing/sample_letters.json' }
  ];

  let filesOk = true;
  for (const { path: relPath, name } of dataFiles) {
    const fullPath = path.join(__dirname, relPath);
    if (!fs.existsSync(fullPath)) {
      filesOk = false;
      recordError(
        'ERR_FILE_NOT_FOUND',
        `File Missing: ${name}`,
        `The file could not be found at path: ${fullPath}`,
        `Ensure data files exist. Run Git checkout or check data/ folder.`
      );
    } else {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (name.endsWith('.txt')) {
          recordPass(`Data Integrity: ${name}`, `${content.length} characters`);
        } else {
          const parsed = JSON.parse(content);
          const count = Array.isArray(parsed) ? `${parsed.length} items` : 'Valid JSON Object';
          recordPass(`Data Integrity: ${name}`, count);
        }
      } catch (jsonErr) {
        filesOk = false;
        recordError(
          'ERR_JSON_SYNTAX_CORRUPTED',
          `Corrupted File: ${name}`,
          `Syntax error reading file: ${jsonErr.message}`,
          `Open ${name} in VS Code, inspect red syntax squiggles, remove stray commas or unclosed brackets.`
        );
      }
    }
  }

  // ==========================================================================
  // CHECK 3: IS MONGODB ATLAS CONNECTED (5-SECOND TIMEOUT)?
  // ==========================================================================
  console.log(`\n${BOLD}3. Checking MongoDB Atlas Live Connection...${RESET}`);
  if (mongoose && process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<username>')) {
    try {
      // 5-second server selection timeout to prevent stage freezes
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });
      recordPass("MongoDB Atlas Connection", "Live ping successful (<5s)");
      await mongoose.disconnect();
    } catch (dbErr) {
      const msg = dbErr.message.toLowerCase();
      if (msg.includes('whitelist') || msg.includes('timed out') || msg.includes('serverselectionerror')) {
        recordError(
          'ERR_MONGO_IP_BLOCKED',
          'MongoDB Atlas IP Whitelist Blocked',
          `Connection timed out after 5000ms. Your current network IP is not whitelisted in Atlas.`,
          `Go to MongoDB Atlas -> Security -> Network Access -> Click 'Add IP Address' -> Select 'Allow Access from Anywhere' (0.0.0.0/0).`
        );
      } else if (msg.includes('auth') || msg.includes('bad auth')) {
        recordError(
          'ERR_MONGO_AUTH_FAILED',
          'MongoDB Atlas Authentication Failed',
          `Invalid username or password in MONGODB_URI.`,
          `Check Database Access in Atlas. Verify username and password (special characters must be URL-encoded).`
        );
      } else {
        recordError(
          'ERR_MONGO_CONNECTION_FAILED',
          'MongoDB Connection Error',
          dbErr.message,
          `Verify your MONGODB_URI format: mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/overturn`
        );
      }
    }
  } else if (!mongoose) {
    // Already recorded in Step 0
  } else {
    recordError(
      'ERR_MONGO_SKIPPED',
      'MongoDB Connection Skipped',
      'MONGODB_URI is missing or contains placeholder text.',
      'Configure MONGODB_URI in .env to enable database connectivity tests.'
    );
  }

  // ==========================================================================
  // CHECK 4: IS GEMINI API RESPONDING LIVE?
  // ==========================================================================
  console.log(`\n${BOLD}4. Checking Google Gemini API Live Ping...${RESET}`);
  let geminiClient = null;

  if (GoogleGenAI && process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your_')) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const testModel = process.env.GEMINI_MODEL_ID || 'gemini-2.5-flash';

      // Test minimal generation ping
      const pingResponse = await geminiClient.models.generateContent({
        model: testModel,
        contents: "Respond with the single word: PONG",
      });

      const responseText = pingResponse.text?.trim() || "";
      recordPass("Gemini API Ping", `Model ${testModel} replied: "${responseText.substring(0, 15)}"`);
    } catch (aiErr) {
      const msg = aiErr.message.toLowerCase();
      if (msg.includes('api_key_invalid') || msg.includes('unauthorized') || msg.includes('403')) {
        recordError(
          'ERR_GEMINI_AUTH_INVALID',
          'Gemini API Key Invalid or Unauthorized',
          `API rejected credentials: ${aiErr.message}`,
          `Generate a fresh API key at Google AI Studio (https://aistudio.google.com/) and update GEMINI_API_KEY in .env.`
        );
      } else if (msg.includes('quota') || msg.includes('429') || msg.includes('rate limit')) {
        recordError(
          'ERR_GEMINI_QUOTA_EXCEEDED',
          'Gemini API Rate Limit / Quota Exceeded',
          `API quota exhausted: ${aiErr.message}`,
          `Switch to a backup Google account API key or wait for quota window to reset.`
        );
      } else if (msg.includes('enotfound') || msg.includes('network') || msg.includes('fetch failed')) {
        recordError(
          'ERR_GEMINI_NETWORK_BLOCKED',
          'Gemini API Network Connection Failed',
          `Cannot reach generativelanguage.googleapis.com: ${aiErr.message}`,
          `Hackathon venue Wi-Fi firewall may be blocking Google API ports. Switch to your mobile hotspot immediately.`
        );
      } else {
        recordError(
          'ERR_GEMINI_PING_FAILED',
          'Gemini API Request Failed',
          aiErr.message,
          `Check model name in GEMINI_MODEL_ID (recommended: gemini-2.5-flash).`
        );
      }
    }
  } else if (!GoogleGenAI) {
    // Already recorded in Step 0
  } else {
    recordError(
      'ERR_GEMINI_SKIPPED',
      'Gemini API Ping Skipped',
      'GEMINI_API_KEY is missing or contains placeholder text.',
      'Configure a valid GEMINI_API_KEY in .env to enable AI tests.'
    );
  }

  // ==========================================================================
  // CHECK 5: ARE VECTOR DIMENSIONS CORRECT (EXACT 768-DIM ASSERTION)?
  // ==========================================================================
  console.log(`\n${BOLD}5. Checking Embedding Vector Dimensions (Gate 1)...${RESET}`);
  if (geminiClient) {
    try {
      const embedModel = process.env.GEMINI_EMBEDDING_MODEL_ID || 'text-embedding-004';
      const expectedDim = parseInt(process.env.EMBEDDING_DIMENSIONS || '768', 10);

      const embedResponse = await geminiClient.models.embedContent({
        model: embedModel,
        content: { parts: [{ text: "Project Overturn Dimension Assertion Test" }] },
        config: { outputDimensionality: expectedDim }
      });

      const actualDim = embedResponse.embedding?.values?.length;

      if (actualDim === expectedDim) {
        recordPass(
          "Embedding Dimensions Assertion",
          `Generated exact ${actualDim}-dim vector matching MongoDB Atlas index definition`
        );
      } else {
        recordError(
          'ERR_VECTOR_DIMENSION_MISMATCH',
          'Vector Dimension Mismatch',
          `Expected ${expectedDim} dimensions, but model returned ${actualDim} dimensions.`,
          `Ensure outputDimensionality is set to 768 in API config or update EMBEDDING_DIMENSIONS in .env to match index.`
        );
      }
    } catch (embedErr) {
      recordError(
        'ERR_EMBEDDING_API_FAILED',
        'Embedding Generation Failed',
        embedErr.message,
        `Verify GEMINI_EMBEDDING_MODEL_ID (use 'text-embedding-004' or 'gemini-embedding-001').`
      );
    }
  } else {
    recordError(
      'ERR_EMBED_SKIPPED',
      'Embedding Test Skipped',
      'Cannot test embeddings because Gemini client is not initialized.',
      'Resolve Gemini API key and dependencies first.'
    );
  }

  // ==========================================================================
  // FINAL DIAGNOSTIC REPORT & ACTION PLAN
  // ==========================================================================
  console.log(`\n${BOLD}=======================================================${RESET}`);
  if (issues.length === 0) {
    console.log(` ${GREEN}${BOLD}🎉 ALL 5 DIAGNOSTIC CHECKS PASSED: SYSTEM VERIFIED!${RESET}`);
    console.log(` ${CYAN}✓ API keys active${RESET}`);
    console.log(` ${CYAN}✓ Data files intact (0 corrupted)${RESET}`);
    console.log(` ${CYAN}✓ MongoDB Atlas connected (<5s ping)${RESET}`);
    console.log(` ${CYAN}✓ Gemini model responding live${RESET}`);
    console.log(` ${CYAN}✓ Exact 768-dim vector embeddings confirmed${RESET}`);
    console.log(`\n ${BOLD}👉 You are ready to present to judges with zero fear of crashes.${RESET}`);
    console.log(`${BOLD}=======================================================${RESET}\n`);
    process.exit(0);
  } else {
    console.log(` ${RED}${BOLD}⚠️  PRE-FLIGHT DIAGNOSTICS FAILED (${issues.length} Issues Detected)${RESET}`);
    console.log(` ${YELLOW}Do NOT present or demo until the following actionable fixes are applied:${RESET}\n`);

    issues.forEach((issue, idx) => {
      console.log(` ${BOLD}${idx + 1}. [${issue.code}] ${issue.title}${RESET}`);
      console.log(`    ${RED}Problem:${RESET} ${issue.details}`);
      console.log(`    ${GREEN}Fix:${RESET}     ${issue.recommendedFix}\n`);
    });

    console.log(`${BOLD}=======================================================${RESET}\n`);
    process.exit(1);
  }
}

runAllChecks();
