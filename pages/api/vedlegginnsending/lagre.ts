import { randomUUID } from 'crypto';
import {
  isMock,
  tokenXApiStreamProxy,
  beskyttetApi,
  getAccessTokenFromRequest,
  logInfo,
} from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';

const handler = beskyttetApi(async (req, res) => {
  logInfo('Har mottatt request om filopplasting i vedlegg innsending');
  const accessToken = getAccessTokenFromRequest(req);
  if (isMock()) res.status(201).json({ filId: randomUUID() });
  await tokenXApiStreamProxy({
    url: `${process.env.INNSENDING_URL}/mellomlagring/fil`,
    prometheusPath: '/mellomlagring/fil',
    req,
    res,
    audience: process.env.INNSENDING_AUDIENCE!,
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
