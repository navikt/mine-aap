import { NextApiRequest, NextApiResponse } from 'next';
import { getCommaSeparatedStringFromStringOrArray } from '@navikt/aap-felles-utils-client';
import {
  logger,
  isMock,
  tokenXApiProxy,
  beskyttetApi,
  getAccessTokenFromRequest,
} from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
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
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
};

export default handler;
