import 'server-only';

import { mockDokumenter } from 'lib/mock/mockDokumenter';
import { fetchPdf, fetchProxy } from 'lib/services/fetchProxy';
import { Dokument } from 'lib/types/types';
import { isMock } from 'lib/utils/environments';
import { logError } from '@navikt/aap-felles-utils';

const oppslagApiBaseUrl = process.env.OPPSLAG_URL;
const oppslagAudience = process.env.OPPSLAG_AUDIENCE ?? '';

/* TODO: Bruker fetchProxy fra saksbehandling. Må testes at backenden for oppslag returnerer samme statuskoder som behandlingsflyt og de andre backendappene våre */

export const hentDokumenter = async (): Promise<Dokument[]> => {
  if (isMock()) return mockDokumenter;
  const url = `${oppslagApiBaseUrl}/dokumenter`;
  try {
    return await fetchProxy<Dokument[]>(url, oppslagAudience, 'GET');
  } catch (error) {
    logError('Klarer ikke hente dokumenter fra oppslag', error);
    return [];
  }
};

export const hentDokument = async (journalPostId: string, dokumentInfoId: string) => {
  const url = `${oppslagApiBaseUrl}/dokumenter/${journalPostId}/${dokumentInfoId}`;
  return await fetchPdf(url, oppslagAudience);
};
