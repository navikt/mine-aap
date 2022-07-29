import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessTokenFromRequest } from '../../../auth/accessToken';
import { beskyttetApi } from '../../../auth/beskyttetApi';
import { isMock } from '../../../utils/environments';
import { getStringFromPossiblyArrayQuery } from '../../../utils/string';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const uuid = getStringFromPossiblyArrayQuery(req.query.uuid);
  if (!uuid) {
    res.status(400).json({ error: 'uuid må være en string' });
  }
  const accessToken = getAccessTokenFromRequest(req);
  await slettVedlegg(uuid as string, accessToken);
  res.status(204).end();
});

export const slettVedlegg = async (uuid: string, accessToken?: string) => {
  if (isMock()) return;
  return;
};

export default handler;
