const test = require('node:test');
const assert = require('node:assert/strict');

const modules = [
  '../src/modules/hrm/routes',
  '../src/modules/ess/routes',
  '../src/modules/iam/routes',
  '../src/modules/payments/routes',
  '../src/modules/settings/routes',
  '../src/modules/gateway/routes',
  '../src/modules/products/routes',
];

test('domain module routers can be loaded without circular import failures', () => {
  for (const modulePath of modules) {
    const router = require(modulePath);
    assert.equal(typeof router, 'function', `${modulePath} should export an Express router`);
  }
});

test('HRM employee email domain exposes all migrated handlers', () => {
  const controller = require('../src/modules/hrm/features/employees/email.controller');
  for (const name of ['sendEmail', 'getInbox', 'getSent', 'getEmailThread', 'markEmailRead']) {
    assert.equal(typeof controller[name], 'function', `${name} should be exported`);
  }
});

test('HRM employee email service exposes domain operations', () => {
  const service = require('../src/modules/hrm/features/employees/email.service');
  for (const name of ['sendEmail', 'getInbox', 'getSent', 'getThread', 'markRead']) {
    assert.equal(typeof service[name], 'function', `${name} should be exported`);
  }
});
