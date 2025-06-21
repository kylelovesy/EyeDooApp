// jest.setup.js

// Mock for react-native-get-random-values
jest.mock('react-native-get-random-values', () => ({
  getRandomBase64: jest.fn(),
}));

// Attempt to stabilize React Native Paper's Icon rendering in tests
jest.mock('react-native-paper/src/components/Icon', () => {
  const { View } = require('react-native');
  return jest.fn().mockImplementation(props => <View {...props} />);
});

// Mock for async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// You might need to mock other native modules if they cause issues
// For example, react-native-reanimated:
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence console.warn and console.error for cleaner test output if necessary
// global.console = {
//   ...console,
//   // log: jest.fn(),
//   // warn: jest.fn(),
//   // error: jest.fn(),
// };
