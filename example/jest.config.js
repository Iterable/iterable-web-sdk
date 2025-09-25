const { pathsToModuleNameMapper } = require('ts-jest');
const config = require('./tsconfig.json');

const remappedPaths = pathsToModuleNameMapper(config.compilerOptions.paths, {
  prefix: '<rootDir>/'
});

module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  transform: { '^.+\\.(t|j)sx?$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: Object.keys(remappedPaths).reduce((acc, key) => {
    if (key === '^(.*)$') {
      return acc;
    }
    acc[key] = remappedPaths[key];
    return acc;
  }, {})
};
