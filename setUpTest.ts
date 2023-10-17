import '@testing-library/jest-dom';
require('jest-fetch-mock').enableMocks();
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
