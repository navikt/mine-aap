import {
  beskyttetApi,
  getAccessTokenFromRequest,
  isMock,
  logger,
  tokenXApiStreamProxy,
} from '@navikt/aap-felles-innbygger-utils';
import { randomUUID } from 'crypto';
import metrics from 'lib/metrics';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  logger.info('Har mottatt request om filopplasting');
  const accessToken = getAccessTokenFromRequest(req);
  if (isMock()) {
    res.status(201).json(randomUUID());
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
