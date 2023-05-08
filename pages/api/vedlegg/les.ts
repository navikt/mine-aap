import { NextApiRequest, NextApiResponse } from 'next';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { isMock, beskyttetApi } from '@navikt/aap-felles-innbygger-utils';
import { tokenXProxy } from '../../../lib/api/tokenXProxy';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const uuid = getStringFromPossiblyArrayQuery(req.query.uuid);
  if (!uuid) {
    res.status(400).json({ error: 'uuid må være en string' });
  }
  //if (isMock()) return fetch('http://localhost:3000/aap/mine-aap/Rød.png');
  return await tokenXProxy(req, res, `/vedlegg/les/${uuid}`, '/vedlegg/les/{uuid}');
});

export const config = {
  api: {
    responseLimit: '50mb',
    bodyParser: false,
    externalResolver: true,
  },
};

export default handler;
