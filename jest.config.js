module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  // figure out why this breaks line numbers
  // collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  setupTestFrameworkScriptFile: '<rootDir>test/setup.js'
};
