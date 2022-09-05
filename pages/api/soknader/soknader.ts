import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessTokenFromRequest } from 'lib/auth/accessToken';
import { beskyttetApi } from 'lib/auth/beskyttetApi';
import { tokenXProxy } from 'lib/auth/tokenXProxy';
import { mockSøknader } from 'lib/mock/mockSoknad';
import { isMock } from 'lib/utils/environments';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = getAccessTokenFromRequest(req);
  const søknader = await getSøknader(accessToken);
  res.status(200).json(søknader);
});

export const getSøknader = async (accessToken?: string) => {
  if (isMock()) return mockSøknader;
  const søknader = await tokenXProxy({
    url: `${process.env.SOKNAD_API_URL}/oppslag/soeknader`,
    method: 'GET',
    audience: process.env.SOKNAD_API_AUDIENCE ?? '',
    bearerToken: accessToken,
  });
  return søknader;
};

export default handler;
