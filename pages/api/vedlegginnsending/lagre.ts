import { randomUUID } from 'crypto';
import {
  logger,
  isMock,
  tokenXApiStreamProxy,
  beskyttetApi,
  getAccessTokenFromRequest,
} from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';

const handler = beskyttetApi(async (req, res) => {
  logger.info('Har mottatt request om filopplasting i vedlegg innsending');
  const accessToken = getAccessTokenFromRequest(req);
  if (isMock()) res.status(201).json({ filId: randomUUID() });
  await tokenXApiStreamProxy({
    url: `${process.env.INNSENDING_URL}/mellomlagring/fil`,
    prometheusPath: '/mellomlagring/fil',
    req,
    res,
    audience: process.env.INNSENDING_AUDIENCE!,
    bearerToken: accessToken,
    logger: logger,
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
