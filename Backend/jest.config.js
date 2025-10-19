module.exports = {
  projects: [
    // --- FRONTEND ---
    {
      displayName: 'frontend',
      preset: 'jest-expo',
      setupFiles: ['./jest.setup.js'],
      setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/components/__tests__/**/*.[jt]s?(x)',
        '<rootDir>/app/**/__tests__/**/*.[jt]s?(x)',
      ],
      transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native|expo|@expo|@react-navigation))',
      ],
    },

    // --- BACKEND ---
    {
      displayName: 'backend',
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/jest.backend.setup.js'],
      testMatch: ['<rootDir>/Backend/test/**/*.test.js'],
      transform: {}, // Keep no transform
      // ✅ Removed extensionsToTreatAsEsm
      moduleNameMapper: {},
    },
  ],
};
