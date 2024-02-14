import { beskyttetApi, getAccessTokenFromRequest, isMock, logger, tokenXApiProxy } from '@navikt/aap-felles-utils';
import { mockEttersendelserSoknad } from 'lib/mock/mockSoknad';
import metrics from 'lib/metrics';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';

const handler = beskyttetApi(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
  const journalpostId = getStringFromPossiblyArrayQuery(req.query.journalpostId);
  if (!journalpostId) {
    res.status(400).json({ error: 'journalpostId må være satt' });
  } else {
    const dokumentJson = await getDokumentJson(journalpostId, accessToken);
    res.status(200).json(dokumentJson);
  }
});

export const getDokumentJson = async (journalpostId: string, accessToken?: string): Promise<unknown> => {
  if (isMock()) return mockEttersendelserSoknad;
  const dokumentJson = await tokenXApiProxy({
    url: `${process.env.OPPSLAG_URL}/dokumenter/${journalpostId}/json`,
    prometheusPath: '/oppslag/dokumenter/[journalpostid]/json',
    method: 'GET',
    audience: process.env.OPPSLAG_AUDIENCE ?? '',
    bearerToken: accessToken,
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
  return dokumentJson;
};

export default handler;
