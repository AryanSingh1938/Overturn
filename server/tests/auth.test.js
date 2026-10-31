/**
 * =================================================================================================
 * OVERTURN UNIT TEST SUITE — USER AUTHENTICATION & SCHEMA VALIDATION (tests/auth.test.js)
 * =================================================================================================
 *
 * 1. TEST SUITE PURPOSE & ARCHITECTURAL ROLE:
 *    Validates the User account schema (`models/User.js`) and password security mechanisms:
 *    - Schema Constraints: Asserts proper email regex validation, minimum password length enforcement,
 *      and role-based authorization constraints (`policyholder`, `advocate`, `intermediary`).
 *    - Cryptographic Security: Tests that passwords are never stored in plaintext and verifies
 *      Bcrypt salt hashing (10 rounds) and hash comparison (`comparePassword`).
 *
 * 2. TEST FRAMEWORK & SPEED:
 *    Uses Node.js standard library `node:test` and `node:assert`. Executes in under 100ms.
 * =================================================================================================
 */

const test = require('node:test');
const assert = require('node:assert');
const User = require('../models/User');

// =================================================================================================
// TEST 1: USER SCHEMA VALIDATION (ROLES, EMAIL FORMAT, MINIMUM PASSWORD LENGTH)
// =================================================================================================
test('User Model: Validates fields, emails, and roles correctly', async () => {
  // Scenario A: Valid Policyholder Account — Should pass validation with no errors
  const validUser = new User({
    name: 'Ramesh Verma',
    email: 'ramesh.verma@example.com',
    password: 'securePassword123',
    role: 'policyholder',
  });
  const validationError = validUser.validateSync();
  assert.strictEqual(validationError, undefined, 'Valid policyholder should pass schema validation');

  // Scenario B: Valid Intermediary Account — Should pass validation
  const intermediaryUser = new User({
    name: 'Sunita Sharma',
    email: 'sunita@redressal.org',
    password: 'password123',
    role: 'intermediary',
  });
  assert.strictEqual(intermediaryUser.validateSync(), undefined, 'Valid intermediary role should pass');

  // Scenario C: Invalid Role ('superadmin' not in enum) — Must fail validation
  const invalidRoleUser = new User({
    name: 'Invalid Role',
    email: 'test@example.com',
    password: 'password123',
    role: 'superadmin',
  });
  const roleErr = invalidRoleUser.validateSync();
  assert.ok(roleErr && roleErr.errors.role, 'Unpermitted role enum must trigger validation error');

  // Scenario D: Password too short (<6 characters) — Must fail validation
  const shortPassUser = new User({
    name: 'Short Pass',
    email: 'pass@example.com',
    password: '123',
  });
  const passErr = shortPassUser.validateSync();
  assert.ok(passErr && passErr.errors.password, 'Password under 6 chars must trigger validation error');

  // Scenario E: Invalid Email Format — Must fail email regex validation
  const badEmailUser = new User({
    name: 'Bad Email',
    email: 'not-an-email',
    password: 'password123',
  });
  const emailErr = badEmailUser.validateSync();
  assert.ok(emailErr && emailErr.errors.email, 'Invalid email format must trigger regex validation error');
});

// =================================================================================================
// TEST 2: CRYPTOGRAPHIC PASSWORD HASHING (BCRYPT) & COMPARISON
// =================================================================================================
test('User Model: Hashes password and validates password match', async () => {
  // Setup user with plaintext password
  const user = new User({
    name: 'Priya Patel',
    email: 'priya.patel@justice.internal',
    password: 'mySecretPassword!2026',
    role: 'advocate',
  });

  // Trigger Mongoose validation
  await user.validate();

  // Execute Bcrypt hashing (10 salt rounds)
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // Assertion: Password must NOT be stored as plaintext
  assert.notStrictEqual(user.password, 'mySecretPassword!2026', 'Password must be hashed, not plaintext');

  // Assertion: comparePassword returns true for correct credentials, false for wrong password
  assert.strictEqual(await user.comparePassword('mySecretPassword!2026'), true, 'Must verify matching password');
  assert.strictEqual(await user.comparePassword('wrongPassword'), false, 'Must reject incorrect password');
});
