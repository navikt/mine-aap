import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetApi } from '@navikt/aap-felles-utils';
import { tokenXProxy } from 'lib/api/tokenXProxy';

const handler = beskyttetApi(async (req, res) => {
  const uuid = getStringFromPossiblyArrayQuery(req.query.uuid);
  if (!uuid) {
    res.status(400).json({ error: 'uuid må være en string' });
  }

  return await tokenXProxy(
    req,
    res,
    `/vedlegg/les/${uuid}`,
    '/vedlegg/les',
    'soknad-api',
    process.env.SOKNAD_API_AUDIENCE!
  );
});

export const config = {
  api: {
    responseLimit: '50mb',
    bodyParser: false,
    externalResolver: true,
  },
};

export default handler;
