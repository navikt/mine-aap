import { getCommaSeparatedStringFromStringOrArray } from '@navikt/aap-felles-utils-client';
import { beskyttetApi, getAccessTokenFromRequest, isMock, tokenXApiProxy } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';

const handler = beskyttetApi(async (req, res) => {
  const uuids = req.query.uuid ?? [];
  if (!uuids) {
    res.status(400).json({ error: 'uuid må være en string' });
  }
  const accessToken = getAccessTokenFromRequest(req);

  await slettVedlegg(uuids, accessToken);
  res.status(204).json({});
});
export const slettVedlegg = async (uuids: string | string[], accessToken?: string) => {
  if (isMock()) return;
  const commaSeparatedUuids = getCommaSeparatedStringFromStringOrArray(uuids);
  await tokenXApiProxy({
    url: `${process.env.SOKNAD_API_URL}/vedlegg/slett?uuids=${commaSeparatedUuids}`,
    prometheusPath: '/vedlegg/slett',
    method: 'DELETE',
    noResponse: true,
    audience: process.env.SOKNAD_API_AUDIENCE!,
    bearerToken: accessToken,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default handler;
