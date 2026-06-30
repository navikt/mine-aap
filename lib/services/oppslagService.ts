import 'server-only';

import { mockDokumenter } from 'lib/mock/mockDokumenter';
import { fetchPdf, fetchProxy } from 'lib/services/fetchProxy';
import type { HentDokumenterResponse } from 'lib/types/types';
import type { FetchResponse } from 'lib/utils/api-fetch';
import { isMock } from 'lib/utils/environments';

const oppslagApiBaseUrl = process.env.OPPSLAG_URL;
const oppslagAudience = process.env.OPPSLAG_AUDIENCE ?? '';

/* TODO: Bruker fetchProxy fra saksbehandling. Må testes at backenden for oppslag returnerer samme statuskoder som behandlingsflyt og de andre backendappene våre */

export async function hentDokumenter(): Promise<FetchResponse<HentDokumenterResponse>> {
  if (isMock()) {
    return { type: 'SUCCESS', status: 200, data: mockDokumenter };
    // return { type: 'ERROR', status: 500, apiException: { message: 'error' } };
  }
  const url = `${oppslagApiBaseUrl}/dokumenter`;
  return await fetchProxy<HentDokumenterResponse>(url, oppslagAudience, 'GET');
}

export async function hentDokument(journalPostId: string, dokumentInfoId: string) {
  const url = `${oppslagApiBaseUrl}/dokumenter/${journalPostId}/${dokumentInfoId}`;
  return await fetchPdf(url, oppslagAudience);
}
