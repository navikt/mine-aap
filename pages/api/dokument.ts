import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetApi } from '@navikt/aap-felles-utils';
import { tokenXProxy } from 'lib/api/tokenXProxy';
import { randomUUID } from 'crypto';

const handler = beskyttetApi(async (req, res) => {
  const journalpostId = getStringFromPossiblyArrayQuery(req.query.journalpostId);
  const dokumentId = getStringFromPossiblyArrayQuery(req.query.dokumentId);
  if (!journalpostId || !dokumentId) {
    res.status(400).json({ error: 'journalpostId og dokumentId må være satt' });
  }

  const callid = randomUUID();
  req.headers['Nav-CallId'] = callid;

  return await tokenXProxy(
    req,
    res,
    `/dokumenter/${journalpostId}/${dokumentId}`,
    'oppslag',
    process.env.OPPSLAG_AUDIENCE!
  );
});

export const config = {
  api: {
    responseLimit: '50mb',
    bodyParser: false,
  },
};

export default handler;
