import { getStringFromPossiblyArrayQuery } from '../string';

describe('getStringFromPossiblyArrayQuery', () => {
  it('should return the first element of an array', () => {
    const query = ['foo', 'bar'];
    expect(getStringFromPossiblyArrayQuery(query)).toBe('foo');
  });

  it('should return the string if it is not an array', () => {
    const query = 'foo';
    expect(getStringFromPossiblyArrayQuery(query)).toBe('foo');
  });

  it('should return undefined if the query is undefined', () => {
    const query = undefined;
    expect(getStringFromPossiblyArrayQuery(query)).toBeUndefined();
  });
});
