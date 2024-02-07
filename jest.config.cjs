const pkg = require('./package.json');

/** @type {import('jest').Config} */
const config = {
  displayName: pkg.name,
  testMatch: ['**/__tests__/**/*.?(c)[jt]s', '**/?(*.)+(spec|test).?(c)[jt]s'],
  transform: {},
  testEnvironment: 'node',
};

module.exports = config;
