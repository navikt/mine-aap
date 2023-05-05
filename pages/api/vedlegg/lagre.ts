import { randomUUID } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  logger,
  isMock,
  tokenXApiStreamProxy,
  beskyttetApi,
  getAccessTokenFromRequest,
} from '@navikt/aap-felles-innbygger-utils';
import { proxyApiRouteRequest } from '@navikt/next-api-proxy';
import metrics from 'lib/metrics';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  logger.info('Har mottatt request om filopplasting');
  const accessToken = getAccessTokenFromRequest(req);
  if (isMock()) {
    res.status(201).json(randomUUID());
  } else {
    await proxyApiRouteRequest({
      req,
      res,
      hostname: 'soknad-api',
      path: '/vedlegg/lagre',
      bearerToken: accessToken,
      https: false,
    });
    /*await tokenXApiStreamProxy({
      url: `${process.env.SOKNAD_API_URL}/vedlegg/lagre`,
      prometheusPath: '/vedlegg/lagre',
      req,
      res,
      audience: process.env.SOKNAD_API_AUDIENCE!,
      bearerToken: accessToken,
      logger: logger,
      metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
      metricsTimer: metrics.backendApiDurationHistogram,
    });*/
  }
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default handler;
