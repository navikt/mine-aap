import { NextApiRequest, NextApiResponse } from 'next';
import { getCommaSeparatedStringFromStringOrArray } from '@navikt/aap-felles-utils-client';
import { isMock, beskyttetApi } from '@navikt/aap-felles-innbygger-utils';
import { tokenXProxy } from '../../../lib/api/tokenXProxy';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const uuids = req.query.uuid ?? [];
  if (!uuids) {
    res.status(400).json({ error: 'uuid må være en string' });
  }
  if (isMock()) return res.status(204).json({});
  const commaSeparatedUuids = getCommaSeparatedStringFromStringOrArray(uuids);
  return await tokenXProxy(
    req,
    res,
    `/vedlegg/slett'?uuids=${commaSeparatedUuids}`,
    '/vedlegg/slett'
  );
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default handler;
