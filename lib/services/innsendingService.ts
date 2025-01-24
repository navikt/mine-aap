import 'server-only';

import { fetchProxy, getOnBefalfOfToken } from 'lib/services/fetchProxy';
import { InnsendingBackendState, MineAapSoknadMedEttersendingNy } from 'lib/types/types';
import { isMock } from 'lib/utils/environments';
import { mockSøknerMedEttersending } from 'lib/mock/mockSoknad';
import { isAfter } from 'date-fns';
import { logError } from '@navikt/aap-felles-utils';
import { randomUUID } from 'crypto';
import { proxyApiRouteRequest } from '@navikt/next-api-proxy';
import { NextApiRequest, NextApiResponse } from 'next';

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

export const sendEttersendelse = async (data: InnsendingBackendState, innsendingsId?: string): Promise<any> => {
  if (isMock()) {
    return {};
  }
  const erGenerellEttersendelse = innsendingsId ? true : false;
  const url = `${innsendingApiBaseUrl}/innsending${erGenerellEttersendelse ? `/${innsendingsId}` : ''}`;
  try {
    const ettersendelse = await fetchProxy(url, innsendingAudience, 'POST', data);
    return ettersendelse;
  } catch (error) {
    logError('Error sending ettersendelse', error);
    throw new Error('Error sending ettersendelse');
  }
};

export const lagreVedlegg = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  if (isMock()) return { filId: randomUUID() };
  const url = `mellomlagring/fil`;
  const oboToken = await getOnBefalfOfToken(innsendingAudience, url);

  return await proxyApiRouteRequest({
    hostname: 'innsending',
    path: url,
    req: req,
    res: res,
    bearerToken: oboToken,
    https: false,
  });
};

export const hentVedlegg = async (uuid: string, req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  const url = `/mellomlagring/fil/${uuid}`;
  const oboToken = await getOnBefalfOfToken(innsendingAudience, url);
  return await proxyApiRouteRequest({
    hostname: 'innsending',
    path: url,
    req: req,
    res: res,
    bearerToken: oboToken,
    https: false,
  });
};

export const slettVedlegg = async (uuid: string): Promise<any> => {
  if (isMock()) {
    return;
  }

  const url = `${innsendingApiBaseUrl}/mellomlagring/fil/${uuid}`;
  try {
    await fetchProxy(url, innsendingAudience, 'DELETE');
    return;
  } catch (error) {
    logError('Error sletting av vedlegg', error);
    throw new Error('Error sletting av vedlegg');
  }
};
