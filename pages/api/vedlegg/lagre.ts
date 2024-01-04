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
  logger.info('Har mottatt request om filopplasting');
  const accessToken = getAccessTokenFromRequest(req);
  console.log('body', req.body);
  if (isMock()) {
    res.status(201).json(randomUUID());
  } else if (process.env.NY_INNSENDING === 'enabled') {
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
  } else {
    await tokenXApiStreamProxy({
      url: `${process.env.SOKNAD_API_URL}/vedlegg/lagre`,
      prometheusPath: '/vedlegg/lagre',
      req,
      res,
      audience: process.env.SOKNAD_API_AUDIENCE!,
      bearerToken: accessToken,
      logger: logger,
      metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
      metricsTimer: metrics.backendApiDurationHistogram,
    });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
