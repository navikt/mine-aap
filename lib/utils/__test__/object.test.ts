import { flattenObject } from '../object';

describe('Object', () => {
  it('should flatten nested object to key-value pair', () => {
    const obj = {
      a: {
        b: {
          c: {
            message: 'hello',
          },
        },
      },
    };
    const result = flattenObject(obj);
    expect(result).toEqual({
      'a.b.c': 'hello',
    });
  });
  it('should flatten nested object with arrays to key-value pair', () => {
    const obj = {
      a: {
        b: [
          {
            c: {
              message: 'hello',
            },
          },
        ],
      },
    };
    const result = flattenObject(obj);
    expect(result).toEqual({
      'a.b.0.c': 'hello',
    });
  });
  it('should preserve array positions', () => {
    const obj = {
      a: [
        undefined,
        {
          b: {
            c: {
              message: 'hello',
            },
          },
        },
      ],
    };
    const result = flattenObject(obj);
    expect(result).toEqual({
      'a.1.b.c': 'hello',
    });
  });
  it('should support multiple values in array', () => {
    const obj = {
      a: [
        {
          b: {
            message: '1',
          },
        },
        {
          b: {
            message: '2',
          },
        },
        {
          b: {
            message: '3',
          },
        },
      ],
    };
    const result = flattenObject(obj);
    expect(result).toEqual({ 'a.0.b': '1', 'a.1.b': '2', 'a.2.b': '3' });
  });
});
