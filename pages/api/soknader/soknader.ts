import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessTokenFromRequest } from 'lib/auth/accessToken';
import { beskyttetApi } from 'lib/auth/beskyttetApi';
import { tokenXProxy } from 'lib/auth/tokenXProxy';
import { mockSøknader } from 'lib/mock/mockSoknad';
import { isMock } from 'lib/utils/environments';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = getAccessTokenFromRequest(req);
  const params = {};
  const søknader = await getSøknader(params, accessToken);
  res.status(200).json(søknader);
});

export const getSøknader = async (params: Record<string, string>, accessToken?: string) => {
  if (isMock()) return mockSøknader;
  const urlParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const søknader = await tokenXProxy({
    url: `${process.env.SOKNAD_API_URL}/oppslag/soeknader${urlParams ? '?' + urlParams : ''}`,
    method: 'GET',
    audience: process.env.SOKNAD_API_AUDIENCE ?? '',
    bearerToken: accessToken,
  });
  return søknader;
};

export default handler;
