import 'server-only';

import { fetchProxy } from 'lib/services/fetchProxy';
import { MineAapSoknadMedEttersendingNy } from 'lib/types/types';
import { isMock } from 'lib/utils/environments';
import { mockSøknerMedEttersending } from 'lib/mock/mockSoknad';
import { isAfter } from 'date-fns';
import { logError } from '@navikt/aap-felles-utils';

const innsendingApiBaseUrl = process.env.INNSENDING_URL;
const innsendingAudience = process.env.INNSENDING_AUDIENCE ?? '';

/* TODO: Bruker fetchProxy fra saksbehandling. Må testes at backenden for innsending returnerer samme statuskoder som behandlingsflyt og de andre backendappene våre */

export const hentSøknader = async (): Promise<MineAapSoknadMedEttersendingNy[]> => {
  if (isMock()) return mockSøknerMedEttersending;
  const url = `${innsendingApiBaseUrl}/innsending/søknadmedettersendinger`;
  try {
    const søknader = await fetchProxy<MineAapSoknadMedEttersendingNy[]>(url, innsendingAudience, 'GET');
    return søknader.sort((a, b) => (isAfter(new Date(a.mottattDato), new Date(b.mottattDato)) ? -1 : 1));
  } catch (error) {
    logError('Error fetching søknader for innsending', error);
    return [];
  }
};
