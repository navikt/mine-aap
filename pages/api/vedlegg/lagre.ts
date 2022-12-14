import { randomUUID } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { beskyttetApi, getAccessTokenFromRequest } from '@navikt/aap-felles-innbygger-auth';
import { isMock } from 'lib/utils/environments';
import { logger } from '@navikt/aap-felles-innbygger-utils';
import { tokenXApiStreamProxy } from '@navikt/aap-felles-innbygger-auth';
import metrics from 'lib/metrics';

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
