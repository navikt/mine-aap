import { isMock } from '../environments';

describe('Environments', () => {
  it('isMock should be true for localhost', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = 'localhost';
    expect(isMock()).toBe(true);
  });
  it('isMock should be true for labs', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = 'labs';
    expect(isMock()).toBe(true);
  });
  it('isMock should be false for dev', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = 'dev';
    expect(isMock()).toBe(false);
  });
  it('isMock should be false for prod', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = 'prod';
    expect(isMock()).toBe(false);
  });
});
