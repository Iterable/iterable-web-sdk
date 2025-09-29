const { pathsToModuleNameMapper } = require('ts-jest');
const config = require('./tsconfig.json');

module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: pathsToModuleNameMapper(config.compilerOptions.paths, {
    prefix: '<rootDir>/'
  }),
  setupFiles: ['fake-indexeddb/auto', 'jest-localstorage-mock'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  transform: { '^.+\\.(t|j)sx?$': 'ts-jest' },
  transformIgnorePatterns: ['node_modules/(?!axios)']
};
