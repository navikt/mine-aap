import { mockSøknader } from 'lib/mock/mockSoknad';
import { logger, isMock, tokenXApiProxy, beskyttetApi, getAccessTokenFromRequest } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';

const handler = beskyttetApi(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
  const søknader = await getSøknader(accessToken);
  res.status(200).json(søknader);
});

export const getSøknader = async (accessToken?: string) => {
  if (isMock()) return mockSøknader;
  const søknader = await tokenXApiProxy({
    url: `${process.env.INNSENDING_API_URL}/innsending/søknader`,
    prometheusPath: '/oppslag/soeknader',
    method: 'GET',
    audience: process.env.INNSENDING_AUDIENCE ?? '',
    bearerToken: accessToken,
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
  return søknader;
};

export default handler;
