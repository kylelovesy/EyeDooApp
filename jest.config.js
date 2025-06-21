module.exports = {
  preset: 'jest-expo',
  // Let jest-expo handle transformations, it should support TypeScript out-of-the-box
  // transform: {
  //   '^.+\\.tsx?$': ['ts-jest', {
  //     tsconfig: 'tsconfig.json',
  //     babelConfig: {
  //       presets: ['babel-preset-expo'],
  //     },
  //   }],
  // },
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect', // For additional matchers
    './jest.setup.js' // For other mocks
  ],
  // transformIgnorePatterns is still important for Expo projects
  // Ensure specific Firebase ESM packages are transformed.
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@firebase/app|@firebase/auth|@firebase/firestore|@firebase/storage|@firebase/functions|@firebase/performance|@firebase/analytics|@firebase/remote-config|@firebase/messaging|@firebase/util|firebase)"
  ],
  moduleNameMapper: {
    '^firebase/app$': '<rootDir>/node_modules/firebase/app/dist/index.cjs.js',
    '^firebase/auth$': '<rootDir>/node_modules/firebase/auth/dist/index.cjs.js',
    // Removed: '^@firebase/auth$': '<rootDir>/node_modules/@firebase/auth/dist/auth.esm.js',
    '^firebase/firestore$': '<rootDir>/node_modules/firebase/firestore/dist/index.cjs.js',
    '^firebase/storage$': '<rootDir>/node_modules/firebase/storage/dist/index.cjs.js',
    '^firebase/functions$': '<rootDir>/node_modules/firebase/functions/dist/index.cjs.js',
    // Add other Firebase services if used and causing similar issues
  },
  // If using path aliases:
  // moduleNameMapper: {
  //   ...previous mappers, // if you have them
  //   '^@/(.*)$': '<rootDir>/src/$1',
  // },
};
