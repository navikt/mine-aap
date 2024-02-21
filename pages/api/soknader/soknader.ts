import { mockSøknader, mockSøknaderInnsending } from 'lib/mock/mockSoknad';
import { beskyttetApi, getAccessTokenFromRequest, isMock, logError, tokenXApiProxy } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';
import { InnsendingSøknad, Søknad } from 'lib/types/types';
import { isAfter } from 'date-fns';
import { IncomingMessage } from 'http';
import { simpleTokenXProxy } from 'lib/api/simpleTokenXProxy';

const handler = beskyttetApi(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
  const params = {};
  const søknader = await getSøknader(params, accessToken);
  res.status(200).json(søknader);
});

export const getSøknaderInnsending = async (req?: IncomingMessage): Promise<InnsendingSøknad[]> => {
  if (isMock()) return mockSøknaderInnsending;
  try {
    const søknader: InnsendingSøknad[] = await simpleTokenXProxy({
      url: `${process.env.INNSENDING_URL}/innsending/søknader`,
      audience: process.env.INNSENDING_AUDIENCE ?? '',
      req,
    });
    return søknader.sort((a, b) => (isAfter(new Date(a.mottattDato), new Date(b.mottattDato)) ? -1 : 1));
  } catch (error) {
    logError('Error fetching søknader for innsending', error);
    return [];
  }
};

export const getSøknader = async (params: Record<string, string>, accessToken?: string): Promise<Array<Søknad>> => {
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
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
  return søknader;
};

export default handler;
