import { mockDokumenter } from 'lib/mock/mockDokumenter';
import { logger, isMock, tokenXApiProxy, beskyttetApi, getAccessTokenFromRequest } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';
import { hentDokumenterFraOppslag } from 'pages/api/nyeapi/dokumenter';

const handler = beskyttetApi(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
  const dokumenter = await getDocuments(accessToken);

  try {
    const dokumenterFraOppslag = await hentDokumenterFraOppslag(accessToken);
    if (dokumenter.length !== dokumenterFraOppslag.length) {
      logger.warn(
        `Dokumenter fra oppslag og dokumenter fra soknad-api er ikke lik. dokumenter fra soknad-api har antall ${dokumenter.length}, og dokumenter fra oppslag har antall ${dokumenterFraOppslag.length}.`
      );
    }
  } catch (e) {
    logger.error('Noe gikk galt i kallet mot oppslag for dokumenter:', e);
  }

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
