import { mockDokumenter } from 'lib/mock/mockDokumenter';
import { logger, isMock, tokenXApiProxy, beskyttetApi, getAccessTokenFromRequest } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';

const handler = beskyttetApi(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
  const dokumenter = await getDocuments(accessToken);
  res.status(200).json(dokumenter);
});

export const getDocuments = async (accessToken?: string) => {
  if (isMock()) return mockDokumenter;
  return await tokenXApiProxy({
    url: `${process.env.OPPSLAG_API_URL}/dokumenter`,
    prometheusPath: '/oppslag/dokumenter',
    method: 'GET',
    audience: process.env.OPPSLAG_AUDIENCE!,
    bearerToken: accessToken,
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
};

export default handler;
