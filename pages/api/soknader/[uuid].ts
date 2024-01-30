import { mockSøknader } from 'lib/mock/mockSoknad';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { logger, isMock, tokenXApiProxy, beskyttetApi, getAccessTokenFromRequest } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';
import { Søknad } from 'lib/types/types';

const handler = beskyttetApi(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
  const uuid = getStringFromPossiblyArrayQuery(req.query.uuid);
  if (!uuid) {
    res.status(400).json({ error: 'uuid må være en string' });
  }

  const søknad = await getSøknad(uuid as string, accessToken);
  res.status(200).json(søknad);
});

export const getSøknad = async (uuid: string, accessToken?: string): Promise<Søknad | undefined> => {
  if (isMock()) return mockSøknader.find((s) => s.søknadId === uuid);
  const søknader = await tokenXApiProxy({
    url: `${process.env.SOKNAD_API_URL}/oppslag/soeknad/${uuid}`,
    prometheusPath: '/oppslag/soeknad/{uuid}',
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
