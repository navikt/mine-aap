import { randomUUID } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessTokenFromRequest } from 'lib/auth/accessToken';
import { beskyttetApi } from 'lib/auth/beskyttetApi';
import { tokenXAxiosProxy } from 'lib/auth/tokenXProxy';
import { isMock } from 'lib/utils/environments';
import { logger } from '@navikt/aap-felles-innbygger-utils';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  logger.info('Har mottatt request om filopplasting');
  const accessToken = getAccessTokenFromRequest(req);
  if (isMock()) {
    res.status(201).json(randomUUID());
  } else {
    await tokenXAxiosProxy({
      url: `${process.env.SOKNAD_API_URL}/vedlegg/lagre`,
      req,
      res,
      audience: process.env.SOKNAD_API_AUDIENCE!,
      bearerToken: accessToken,
    });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
