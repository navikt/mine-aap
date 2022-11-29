import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessTokenFromRequest } from 'lib/auth/accessToken';
import { beskyttetApi } from 'lib/auth/beskyttetApi';
import { mockSøknader } from 'lib/mock/mockSoknad';
import { isMock } from 'lib/utils/environments';
import { getStringFromPossiblyArrayQuery } from 'lib/utils/string';
import { logger } from '@navikt/aap-felles-innbygger-utils';
import { tokenXApiProxy } from '@navikt/aap-felles-innbygger-auth';
import metrics from 'lib/metrics';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = getAccessTokenFromRequest(req);
  const uuid = getStringFromPossiblyArrayQuery(req.query.uuid);
  if (!uuid) {
    res.status(400).json({ error: 'uuid må være en string' });
  }

  const søknad = await getSøknad(uuid as string, accessToken);
  res.status(200).json(søknad);
});

export const getSøknad = async (uuid: string, accessToken?: string) => {
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
