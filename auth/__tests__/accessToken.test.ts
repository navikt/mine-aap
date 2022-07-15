import { IncomingMessage } from 'http';
import { getAccessTokenFromRequest } from '../accessToken';

describe('AccessToken', () => {
  it('getAccessToken should throw if request is not defined', () => {
    expect(() => {
      getAccessTokenFromRequest(undefined);
    }).toThrowError('Context is missing request. This should not happen');
  });
  it('should return access token if it exists as an authroization header', () => {
    const token = 'Bearer 123';
    const request = {
      headers: {
        authorization: token,
      },
    };
    expect(getAccessTokenFromRequest(request as IncomingMessage)).toBe(token);
  });
});
