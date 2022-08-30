import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessTokenFromRequest } from '../../auth/accessToken';
import { beskyttetApi } from '../../auth/beskyttetApi';
import { tokenXProxy } from '../../auth/tokenXProxy';
import { mockSøknader } from '../../mock/mockSoknad';
import { isMock } from '../../utils/environments';

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
