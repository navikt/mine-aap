import 'server-only';

import { randomUUID } from 'node:crypto';
import { proxyRouteHandler } from '@navikt/next-api-proxy';
import { isAfter } from 'date-fns';
import { mockSøknerMedEttersending } from 'lib/mock/mockSoknad';
import { fetchProxy, getOnBefalfOfToken } from 'lib/services/fetchProxy';
import type { InnsendingBackendState, MineAapSoknadMedEttersendingNy } from 'lib/types/types';
import { type FetchResponse, isSuccess } from 'lib/utils/api-fetch';
import { isMock } from 'lib/utils/environments';

const innsendingApiBaseUrl = process.env.INNSENDING_URL;
const innsendingAudience = process.env.INNSENDING_AUDIENCE ?? '';

/* TODO: Bruker fetchProxy fra saksbehandling. Må testes at backenden for innsending returnerer samme statuskoder som behandlingsflyt og de andre backendappene våre */

export const hentSøknader = async (): Promise<FetchResponse<MineAapSoknadMedEttersendingNy[]>> => {
  if (isMock()) {
    return { type: 'SUCCESS', status: 200, data: mockSøknerMedEttersending };
  }
  const url = `${innsendingApiBaseUrl}/innsending/søknadmedettersendinger`;
  const res = await fetchProxy<MineAapSoknadMedEttersendingNy[]>(url, innsendingAudience, 'GET');
  if (isSuccess(res)) {
    return {
      type: res.type,
      status: res.status,
      data: res.data.sort((a, b) => (isAfter(new Date(a.mottattDato), new Date(b.mottattDato)) ? -1 : 1)),
    };
  } else {
    return res;
  }
};

export const sendEttersendelse = async (
  data: InnsendingBackendState,
  innsendingsId?: string
): Promise<FetchResponse<{ referanse: string }>> => {
  if (isMock()) {
    return Promise.resolve({ type: 'SUCCESS', status: 200, data: { referanse: 'klajsg-kasd-sadf-sadfsdga' } });
    // return Promise.resolve({ type: 'ERROR', status: 500, apiException: { message: 'nei nei', code: 'UKJENT' } });
  }
  const erGenerellEttersendelse = !!innsendingsId;
  const url = `${innsendingApiBaseUrl}/innsending${erGenerellEttersendelse ? `/${innsendingsId}` : ''}`;

  return fetchProxy<{ referanse: string }>(url, innsendingAudience, 'POST', data);
};

export const lagreVedlegg = async (req: Request) => {
  if (isMock()) return { filId: randomUUID() };
  const url = `mellomlagring/fil`;
  const oboToken = await getOnBefalfOfToken(innsendingAudience, url);

  return await proxyRouteHandler(req, {
    hostname: 'innsending',
    path: url,
    bearerToken: oboToken,
    https: false,
  });
};

export const hentVedlegg = async (uuid: string, req: Request) => {
  const url = `/mellomlagring/fil/${uuid}`;
  const oboToken = await getOnBefalfOfToken(innsendingAudience, url);
  return await proxyRouteHandler(req, {
    hostname: 'innsending',
    path: url,
    bearerToken: oboToken,
    https: false,
  });
};

export const slettVedlegg = async (uuid: string): Promise<FetchResponse<null>> => {
  if (isMock()) {
    // return { type: 'SUCCESS', status: 204, data: null };
    return { type: 'ERROR', status: 500, apiException: { message: 'ehei' } };
  }

  const url = `${innsendingApiBaseUrl}/mellomlagring/fil/${encodeURIComponent(uuid)}`;
  return fetchProxy<null>(url, innsendingAudience, 'DELETE');
};
