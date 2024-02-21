import { randomUUID } from 'crypto';
import {
  beskyttetApi,
  getAccessTokenFromRequest,
  isMock,
  logInfo,
  tokenXApiStreamProxy,
} from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';

const handler = beskyttetApi(async (req, res) => {
  logInfo('Har mottatt request om filopplasting');
  const accessToken = getAccessTokenFromRequest(req);
  console.log('body', req.body);
  if (isMock()) res.status(201).json(randomUUID());

  await tokenXApiStreamProxy({
    url: `${process.env.SOKNAD_API_URL}/vedlegg/lagre`,
    prometheusPath: '/vedlegg/lagre',
    req,
    res,
    audience: process.env.SOKNAD_API_AUDIENCE!,
    bearerToken: accessToken,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
