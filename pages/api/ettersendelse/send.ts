import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessTokenFromRequest } from '../../../auth/accessToken';
import { beskyttetApi } from '../../../auth/beskyttetApi';
import { isMock } from '../../../utils/environments';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = getAccessTokenFromRequest(req);
  res.status(201).json(await sendEttersendelse(req.body, accessToken));
});

const sendEttersendelse = async (data: string, accessToken?: string) => {
  if (isMock()) {
    return {};
  }
  return {};
};

export default handler;
