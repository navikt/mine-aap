import { randomUUID } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  logger,
  isMock,
  tokenXApiStreamProxy,
  beskyttetApi,
  getAccessTokenFromRequest,
  getTokenX,
} from '@navikt/aap-felles-innbygger-utils';
import { proxyApiRouteRequest } from '@navikt/next-api-proxy';
import metrics from 'lib/metrics';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  logger.info('Har mottatt request om filopplasting');

  if (isMock()) {
    res.status(201).json(randomUUID());
  } else {
    const accessToken = getAccessTokenFromRequest(req)?.substring('Bearer '.length)!;
    let tokenxToken;
    try {
      tokenxToken = await getTokenX(accessToken, process.env.SOKNAD_API_AUDIENCE!);
    } catch (err: any) {
      logger.error({ msg: 'getTokenXError', error: err });
    }
    await proxyApiRouteRequest({
      req,
      res,
      hostname: 'soknad-api',
      path: '/vedlegg/lagre',
      bearerToken: tokenxToken,
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
