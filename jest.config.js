const { pathsToModuleNameMapper } = require('ts-jest/utils');
const config = require('./tsconfig.json');

module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest'
  },
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  setupFiles: ['fake-indexeddb/auto'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: pathsToModuleNameMapper(config.compilerOptions.paths, {
    prefix: '<rootDir>/'
  })
};
