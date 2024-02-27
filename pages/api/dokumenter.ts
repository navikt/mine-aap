import { mockDokumenter } from 'lib/mock/mockDokumenter';
import { isMock, beskyttetApi, logError } from '@navikt/aap-felles-utils';
import { simpleTokenXProxy } from 'lib/api/simpleTokenXProxy';
import { IncomingMessage } from 'http';

const handler = beskyttetApi(async (req, res) => {
  const dokumenter = await hentDokumenterFraOppslag(req);
  res.status(200).json(dokumenter);
});

export const hentDokumenterFraOppslag = async (req?: IncomingMessage) => {
  if (isMock()) return mockDokumenter;
  try {
    const dokumenter = await simpleTokenXProxy({
      url: `${process.env.OPPSLAG_URL}/dokumenter`,
      audience: process.env.OPPSLAG_AUDIENCE ?? '',
      req,
    });
    return dokumenter;
  } catch (error) {
    logError('Error fetching dokumenter mot oppslag', error);
    return [];
  }
};
export default handler;
