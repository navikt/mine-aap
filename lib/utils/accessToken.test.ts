import { stripBearerFromToken } from 'lib/utils/accessToken';

describe('accessToken utils', () => {
  test('stripBearerFromToken - Sjekk at Bearer fjernes fra token', () => {
    const myToken = 'fsflkjgssgjskjlgsg';
    expect(stripBearerFromToken(`Bearer ${myToken}`)).toBe(myToken);
  });
});
