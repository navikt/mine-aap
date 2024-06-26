import { mockSøknaderInnsending } from 'lib/mock/mockSoknad';
import { beskyttetApi, isMock, logError } from '@navikt/aap-felles-utils';
import { InnsendingSøknad } from 'lib/types/types';
import { isAfter } from 'date-fns';
import { IncomingMessage } from 'http';
import { simpleTokenXProxy } from 'lib/api/simpleTokenXProxy';

const handler = beskyttetApi(async (req, res) => {
  const søknader = await getSøknaderInnsending(req);
  res.status(200).json(søknader);
});

export const getSøknaderInnsending = async (req?: IncomingMessage) => {
  if (isMock()) return mockSøknaderInnsending;
  try {
    const søknader = await simpleTokenXProxy<InnsendingSøknad[]>({
      url: `${process.env.INNSENDING_URL}/innsending/søknader`,
      audience: process.env.INNSENDING_AUDIENCE ?? '',
      req,
    });
    return søknader.sort((a, b) => (isAfter(new Date(a.mottattDato), new Date(b.mottattDato)) ? -1 : 1));
  } catch (error) {
    logError('Error fetching søknader for innsending', error);
    return [];
  }
};

export default handler;
