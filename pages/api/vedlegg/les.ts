import { NextApiRequest, NextApiResponse } from 'next';
import { getStringFromPossiblyArrayQuery } from 'lib/utils/string';
import {
  logger,
  isMock,
  tokenXApiProxy,
  beskyttetApi,
  getAccessTokenFromRequest,
} from '@navikt/aap-felles-innbygger-utils';
import metrics from 'lib/metrics';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const uuid = getStringFromPossiblyArrayQuery(req.query.uuid);
  if (!uuid) {
    res.status(400).json({ error: 'uuid må være en string' });
  }
  const accessToken = getAccessTokenFromRequest(req);
  const result = await lesVedlegg(uuid as string, accessToken);
  res.status(200).send(result.body);
});

export const lesVedlegg = async (uuid: string, accessToken?: string) => {
  if (isMock()) return await fetch('http://localhost:3000/aap/mine-aap/Rød.png');
  return await tokenXApiProxy({
    url: `${process.env.SOKNAD_API_URL}/vedlegg/les/${uuid}`,
    prometheusPath: '/vedlegg/les/{uuid}',
    method: 'GET',
    audience: process.env.SOKNAD_API_AUDIENCE!,
    bearerToken: accessToken,
    rawResonse: true,
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
};

export const config = {
  api: {
    responseLimit: '50mb',
  },
};

export default handler;
