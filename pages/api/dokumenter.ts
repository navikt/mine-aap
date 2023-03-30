import {
  beskyttetApi,
  getAccessTokenFromRequest,
  isMock,
  logger,
  tokenXApiProxy,
} from '@navikt/aap-felles-innbygger-utils';
import metrics from 'lib/metrics';
import { mockDokumenter } from 'lib/mock/mockDokumenter';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = getAccessTokenFromRequest(req);
  const dokumenter = await getDocuments(accessToken);
  res.status(200).json(dokumenter);
});

export const getDocuments = async (accessToken?: string) => {
  if (isMock()) return mockDokumenter;
  return await tokenXApiProxy({
    url: `${process.env.SOKNAD_API_URL}/oppslag/dokumenter`,
    prometheusPath: '/oppslag/dokumenter',
    method: 'GET',
    audience: process.env.SOKNAD_API_AUDIENCE!,
    bearerToken: accessToken,
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
};

export default handler;
