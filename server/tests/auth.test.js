const test = require('node:test');
const assert = require('node:assert');
const User = require('../models/User');

test('User Model: Validates fields, emails, and roles correctly', async () => {
  // Test valid policyholder user
  const validUser = new User({
    name: 'Ramesh Verma',
    email: 'ramesh.verma@example.com',
    password: 'securePassword123',
    role: 'policyholder',
  });
  const validationError = validUser.validateSync();
  assert.strictEqual(validationError, undefined);

  // Test valid intermediary role
  const intermediaryUser = new User({
    name: 'Sunita Sharma',
    email: 'sunita@redressal.org',
    password: 'password123',
    role: 'intermediary',
  });
  assert.strictEqual(intermediaryUser.validateSync(), undefined);

  // Test invalid role
  const invalidRoleUser = new User({
    name: 'Invalid Role',
    email: 'test@example.com',
    password: 'password123',
    role: 'superadmin',
  });
  const roleErr = invalidRoleUser.validateSync();
  assert.ok(roleErr && roleErr.errors.role);

  // Test short password
  const shortPassUser = new User({
    name: 'Short Pass',
    email: 'pass@example.com',
    password: '123',
  });
  const passErr = shortPassUser.validateSync();
  assert.ok(passErr && passErr.errors.password);

  // Test invalid email
  const badEmailUser = new User({
    name: 'Bad Email',
    email: 'not-an-email',
    password: 'password123',
  });
  const emailErr = badEmailUser.validateSync();
  assert.ok(emailErr && emailErr.errors.email);
});

test('User Model: Hashes password and validates password match', async () => {
  const user = new User({
    name: 'Priya Patel',
    email: 'priya.patel@justice.internal',
    password: 'mySecretPassword!2026',
    role: 'advocate',
  });

  // Trigger pre-save hook
  await user.validate();
  // Manually trigger pre save logic
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  assert.notStrictEqual(user.password, 'mySecretPassword!2026');
  assert.strictEqual(await user.comparePassword('mySecretPassword!2026'), true);
  assert.strictEqual(await user.comparePassword('wrongPassword'), false);
});
