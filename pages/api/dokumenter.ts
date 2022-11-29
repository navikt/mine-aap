import { NextApiRequest, NextApiResponse } from 'next';
import { beskyttetApi } from 'lib/auth/beskyttetApi';
import { getAccessTokenFromRequest } from 'lib/auth/accessToken';
import { isMock } from 'lib/utils/environments';
import { mockDokumenter } from 'lib/mock/mockDokumenter';
import { logger } from '@navikt/aap-felles-innbygger-utils';
import { tokenXApiProxy } from '@navikt/aap-felles-innbygger-auth';
import metrics from 'lib/metrics';

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
