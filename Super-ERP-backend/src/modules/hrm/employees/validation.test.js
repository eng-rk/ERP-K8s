const test = require('node:test');
const assert = require('node:assert/strict');
const { validateCreateEmployee } = require('./validation');

const validUserId = '507f1f77bcf86cd799439011';

 test('rejects missing required employee fields', () => {
  const errors = validateCreateEmployee({});
  assert.ok(errors.includes('userId must be a valid User id'));
  assert.ok(errors.includes('employeeCode is required'));
});

test('accepts a valid employee payload', () => {
  const errors = validateCreateEmployee({
    userId: validUserId,
    employeeCode: 'EMP-001',
    departmentId: validUserId,
    positionId: validUserId,
    managerId: validUserId,
    joinDate: '2026-08-23',
    employmentStatus: 'active'
  });
  assert.deepEqual(errors, []);
});

test('rejects invalid ids, date and status', () => {
  const errors = validateCreateEmployee({
    userId: 'bad-id',
    employeeCode: 'EMP-001',
    departmentId: 'bad-id',
    joinDate: 'not-a-date',
    employmentStatus: 'unknown'
  });
  assert.ok(errors.includes('userId must be a valid User id'));
  assert.ok(errors.includes('departmentId must be a valid id'));
  assert.ok(errors.includes('joinDate must be a valid date'));
  assert.ok(errors.includes('invalid employmentStatus'));
});
