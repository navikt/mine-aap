import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetApi } from '@navikt/aap-felles-utils';
import { tokenXProxy } from 'lib/api/tokenXProxy';
import * as process from 'process';

const handler = beskyttetApi(async (req, res) => {
  const journalpostId = getStringFromPossiblyArrayQuery(req.query.journalpostId);
  const dokumentId = getStringFromPossiblyArrayQuery(req.query.dokumentId);
  if (!journalpostId || !dokumentId) {
    res.status(400).json({ error: 'journalpostId og dokumentId må være satt' });
  }

  return await tokenXProxy(
    req,
    /* @ts-ignore: TODO: Følge opp med tokenXproxy repo for å fikse type */
    res,
    `/oppslag/dokument/${journalpostId}/${dokumentId}`,
    '/oppslag/dokument',
    'soknad-api',
    process.env.SOKNAD_API_AUDIENCE
  );
});

export const config = {
  api: {
    responseLimit: '50mb',
    bodyParser: false,
  },
};

export default handler;
