import { mockSøknader, mockSøknaderInnsending } from 'lib/mock/mockSoknad';
import { beskyttetApi, isMock, logger, tokenXApiProxy } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';
import { InnsendingSøknad, Søknad } from 'lib/types/types';
import { isAfter } from 'date-fns';
import { getSession } from '@navikt/oasis';
import { NextApiRequest } from 'next';
import { IncomingMessage } from 'http';

const handler = beskyttetApi(async (req, res) => {
  const params = {};
  const søknader = await getSøknader(params, req);
  res.status(200).json(søknader);
});

export const getSøknaderInnsending = async (accessToken?: string): Promise<InnsendingSøknad[]> => {
  if (isMock()) return mockSøknaderInnsending;
  const søknader: InnsendingSøknad[] = await tokenXApiProxy({
    url: `${process.env.INNSENDING_URL}/innsending/søknader`,
    prometheusPath: '/innsending/soeknader',
    method: 'GET',
    audience: process.env.INNSENDING_AUDIENCE ?? '',
    bearerToken: accessToken,
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
  return søknader.sort((a, b) => (isAfter(new Date(a.mottattDato), new Date(b.mottattDato)) ? -1 : 1));
};

export const getSøknader = async (
  params: Record<string, string>,
  req: NextApiRequest | IncomingMessage
): Promise<Array<Søknad>> => {
  if (isMock()) return mockSøknader;
  const urlParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const session = await getSession(req);
  const onBehalfOfToken = await session.apiToken(process.env.SOKNAD_API_AUDIENCE ?? '');

  const søknader = await tokenXApiProxy({
    url: `${process.env.SOKNAD_API_URL}/oppslag/soeknader${urlParams ? '?' + urlParams : ''}`,
    prometheusPath: '/oppslag/soeknader',
    method: 'GET',
    audience: process.env.SOKNAD_API_AUDIENCE ?? '',
    bearerToken: onBehalfOfToken,
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
  return søknader;
};

export default handler;
