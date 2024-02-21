import { beskyttetApi, isMock, logError } from '@navikt/aap-felles-utils';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { simpleTokenXProxy } from 'lib/api/simpleTokenXProxy';
import { IncomingMessage } from 'http';

const handler = beskyttetApi(async (req, res) => {
  const journalpostId = getStringFromPossiblyArrayQuery(req.query.journalpostId);
  if (!journalpostId) {
    res.status(400).json({ error: 'journalpostId må være satt' });
  } else {
    const dokumentJson = await getDokumentJson(journalpostId, req);
    res.status(200).json(dokumentJson);
  }
});

export const getDokumentJson = async (
  journalpostId: string,
  req?: IncomingMessage
): Promise<Record<string, object>> => {
  if (isMock()) return {};
  try {
    // TODO: Vi må ha type på dokumentJson
    const dokumentJson: Record<string, object> = await simpleTokenXProxy({
      url: `${process.env.OPPSLAG_URL}/dokumenter/${journalpostId}/json`,
      audience: process.env.OPPSLAG_AUDIENCE ?? '',
      req,
    });
    return dokumentJson;
  } catch (error) {
    logError(`Error fetching dokumentJson for journalpostId ${journalpostId}`, error);
    return {};
  }
};

export default handler;
