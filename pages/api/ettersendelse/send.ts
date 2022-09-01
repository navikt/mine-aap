import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessTokenFromRequest } from '../../../auth/accessToken';
import { beskyttetApi } from '../../../auth/beskyttetApi';
import { tokenXProxy } from '../../../auth/tokenXProxy';
import { isMock } from '../../../utils/environments';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = getAccessTokenFromRequest(req);
  console.log('body', req.body);
  console.log('stringify', JSON.stringify(req.body));
  console.log('typeof', typeof req.body);
  res.status(201).json(await sendEttersendelse(req.body, accessToken));
});

export const sendEttersendelse = async (data: string, accessToken?: string) => {
  if (isMock()) {
    return {};
  }
  const ettersendelse = await tokenXProxy({
    url: `${process.env.SOKNAD_API_URL}/innsending/ettersend`,
    method: 'POST',
    data: data,
    audience: process.env.SOKNAD_API_AUDIENCE!,
    bearerToken: accessToken,
  });
  return ettersendelse;
};

export default handler;
