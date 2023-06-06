import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetApi, getAccessTokenFromRequest } from '@navikt/aap-felles-utils';
import { tokenXProxy } from 'lib/api/tokenXProxy';

const handler = beskyttetApi(async (req, res) => {
  const journalpostId = getStringFromPossiblyArrayQuery(req.query.journalpostId);
  const dokumentId = getStringFromPossiblyArrayQuery(req.query.dokumentId);
  if (!journalpostId || !dokumentId) {
    res.status(400).json({ error: 'journalpostId og dokumentId må være satt' });
  }
  const accessToken = getAccessTokenFromRequest(req);

  return await tokenXProxy(
    req,
    /* @ts-ignore: TODO: Følge opp med tokenXproxy repo for å fikse type */
    res,
    `/oppslag/dokument/${journalpostId}/${dokumentId}`,
    '/oppslag/dokument'
  );
});

export const config = {
  api: {
    responseLimit: '50mb',
    bodyParser: false,
  },
};

export default handler;
