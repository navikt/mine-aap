import { getAccessTokenFromRequest } from 'lib/auth/accessToken';
import { beskyttetApi } from 'lib/auth/beskyttetApi';
import { tokenXProxy } from 'lib/auth/tokenXProxy';
import { isMock } from 'lib/utils/environments';
import { getStringFromPossiblyArrayQuery } from 'lib/utils/string';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const journalpostId = getStringFromPossiblyArrayQuery(req.query.journalpostId);
  const dokumentId = getStringFromPossiblyArrayQuery(req.query.dokumentId);
  if (!journalpostId || !dokumentId) {
    res.status(400).json({ error: 'journalpostId og dokumentId må være satt' });
  }
  const accessToken = getAccessTokenFromRequest(req);
  const result = await lesDokument(journalpostId as string, dokumentId as string, accessToken);
  const filename = `${journalpostId}-${dokumentId}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  res.status(200).send(result.body);
});

export const lesDokument = async (
  journalpostId: string,
  dokumentId: string,
  accessToken?: string
) => {
  if (isMock()) return await fetch('http://localhost:3000/aap/innsyn/Rød.png');
  return await tokenXProxy({
    url: `${process.env.SOKNAD_API_URL}/oppslag/dokument/${journalpostId}/${dokumentId}`,
    method: 'GET',
    audience: process.env.SOKNAD_API_AUDIENCE!,
    bearerToken: accessToken,
    rawResonse: true,
  });
};

export const config = {
  api: {
    responseLimit: '50mb',
  },
};

export default handler;
