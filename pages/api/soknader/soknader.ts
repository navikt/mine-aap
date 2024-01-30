import { mockSøknader, mockSøknaderInnsending } from 'lib/mock/mockSoknad';
import { logger, isMock, tokenXApiProxy, beskyttetApi, getAccessTokenFromRequest } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';
import { InnsendingSøknad } from 'lib/types/types';

const handler = beskyttetApi(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
  const params = {};
  const søknader = await getSøknader(params, accessToken);
  res.status(200).json(søknader);
});

export const getSøknaderInnsending = async (accessToken?: string): Promise<InnsendingSøknad[]> => {
  if (isMock()) return mockSøknaderInnsending;
  const søknader = await tokenXApiProxy({
    url: `${process.env.INNSENDING_URL}/innsending/søknader`,
    prometheusPath: '/innsending/soeknader',
    method: 'GET',
    audience: process.env.INNSENDING_AUDIENCE ?? '',
    bearerToken: accessToken,
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
  return søknader;
};

export const getSøknader = async (params: Record<string, string>, accessToken?: string) => {
  if (isMock()) return mockSøknader;
  const urlParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const søknader = await tokenXApiProxy({
    url: `${process.env.SOKNAD_API_URL}/oppslag/soeknader${urlParams ? '?' + urlParams : ''}`,
    prometheusPath: '/oppslag/soeknader',
    method: 'GET',
    audience: process.env.SOKNAD_API_AUDIENCE ?? '',
    bearerToken: accessToken,
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
  return søknader;
};

export default handler;
