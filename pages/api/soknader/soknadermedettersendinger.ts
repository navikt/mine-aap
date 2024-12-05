import { mockSøknerMedEttersending } from 'lib/mock/mockSoknad';
import { beskyttetApi, isMock, logError } from '@navikt/aap-felles-utils';
import { MineAapSoknadMedEttersendingNy } from 'lib/types/types';
import { isAfter } from 'date-fns';
import { IncomingMessage } from 'http';
import { simpleTokenXProxy } from 'lib/api/simpleTokenXProxy';

const handler = beskyttetApi(async (req, res) => {
  const søknader = await getSøknaderMedEttersendinger(req);
  res.status(200).json(søknader);
});

export const getSøknaderMedEttersendinger = async (
  req?: IncomingMessage
): Promise<MineAapSoknadMedEttersendingNy[]> => {
  //throw new Error('Not implemented');
  if (isMock()) return mockSøknerMedEttersending;
  try {
    const søknader = await simpleTokenXProxy<MineAapSoknadMedEttersendingNy[]>({
      url: `${process.env.INNSENDING_URL}/innsending/søknadmedettersendinger`,
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
