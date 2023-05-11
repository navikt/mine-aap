import { NextApiRequest, NextApiResponse } from 'next';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetApi } from '@navikt/aap-felles-innbygger-utils';
import { tokenXProxy } from '../../../lib/api/tokenXProxy';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const uuid = getStringFromPossiblyArrayQuery(req.query.uuid);
  if (!uuid) {
    res.status(400).json({ error: 'uuid må være en string' });
  }
  return await tokenXProxy(req, res, `/vedlegg/les/${uuid}`, '/vedlegg/les');
});

export const config = {
  api: {
    responseLimit: '50mb',
  },
};

export default handler;
