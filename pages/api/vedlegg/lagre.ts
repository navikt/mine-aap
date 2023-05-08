import { randomUUID } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { beskyttetApi, isMock, logger } from '@navikt/aap-felles-innbygger-utils';
import { tokenXProxy } from '../../../lib/api/tokenXProxy';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  logger.info('Har mottatt request om filopplasting');

  if (isMock()) {
    res.status(201).json(randomUUID());
  } else {
    return await tokenXProxy(req, res, '/vedlegg/lagre', '/vedlegg/lagre');
  }
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default handler;
