import { isMock } from 'lib/utils/environments';
import { describe, expect, it } from 'vitest';

describe('Environments', () => {
  it('isMock should be false if not localhost', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = 'prod';
    process.env.LOCAL_API = 'MOCK';
    expect(isMock()).toBe(false);
  });
  it('isMock should be true for localhost and LOCAL_API=MOCK', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = 'localhost';
    process.env.LOCAL_API = 'MOCK';
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
