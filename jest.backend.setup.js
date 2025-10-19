// jest.backend.setup.js (CommonJS)

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// mock mongoose or other ESM packages if needed
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  model: jest.fn(() => ({})),
}));
