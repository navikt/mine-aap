'use server';

import { requestOboToken, validateToken } from '@navikt/oasis';
import { getAccessTokenOrRedirectToLogin, logError } from '@navikt/aap-felles-utils';
import { headers } from 'next/headers';
import { randomUUID } from 'crypto';

const NUMBER_OF_RETRIES = 3;

export const getOnBefalfOfToken = async (audience: string, url: string): Promise<string> => {
  const token = getAccessTokenOrRedirectToLogin(await headers());
  if (!token) {
    logError(`Token for ${url} er undefined`);
    throw new Error('Token for simpleTokenXProxy is undefined');
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    logError(`Token for ${url} validerte ikke`);
    throw new Error('Token for simpleTokenXProxy didnt validate');
  }

  const onBehalfOf = await requestOboToken(token, audience);
  if (!onBehalfOf.ok) {
    logError(`Henting av oboToken for ${url} feilet`, onBehalfOf.error);
    throw new Error('Request oboToken for fetchProxy failed');
  }

  return onBehalfOf.token;
};

export const fetchProxy = async <ResponseBody>(
  url: string,
  scope: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  requestBody?: object,
  tags?: string[]
): Promise<ResponseBody> => {
  const oboToken = await getOnBefalfOfToken(scope, url);
  return await fetchWithRetry<ResponseBody>(url, method, oboToken, NUMBER_OF_RETRIES, requestBody, tags);
};

export const fetchPdf = async (url: string, scope: string): Promise<Response> => {
  const callid = randomUUID();
  const oboToken = await getOnBefalfOfToken(scope, url);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${oboToken}`,
      Accept: 'application/pdf',
      'Nav-CallId': callid,
    },
    next: { revalidate: 0 },
  });
  if (response.ok) {
    return response;
  } else {
    logError(`kunne ikke lese pdf på url ${url}.`);
    throw new Error(`kunne ikke lese pdf på url ${url}.`);
  }
};

export const fetchWithRetry = async <ResponseBody>(
  url: string,
  method: string,
  oboToken: string,
  retries: number,
  requestBody?: object,
  tags?: string[]
): Promise<ResponseBody> => {
  if (retries === 0) {
    throw new Error(`Unable to fetch ${url}: ${retries} retries left`);
  }

  const callid = randomUUID();
  const response = await fetch(url, {
    method,
    body: JSON.stringify(requestBody),
    headers: {
      Authorization: `Bearer ${oboToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Nav-CallId': callid,
    },
    next: { revalidate: 0, tags },
  });

  // Mulige statuskoder:
  // 200
  // 204
  // 404
  // 500

  if (response.status === 204) {
    return undefined as ResponseBody;
  }

  if (!response.ok) {
    if (response.status === 500) {
      const responseMessage = await response.text(); // 500 feil fra innsending og oppslag har tekst i body
      logError(`klarte ikke å hente ${url}: ${responseMessage}`);
      throw new Error(`Unable to fetch ${url}: ${responseMessage}`);
    }
    if (response.status === 404) {
      throw new Error(`Ikke funnet: ${url}`);
    }

    logError(
      `Kall mot ${url} feilet med statuskode ${response.status}, prøver på nytt. Antall forsøk igjen: ${retries}`
    );
    return await fetchWithRetry(url, method, oboToken, retries - 1, requestBody, tags);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text')) {
    return (await response.text()) as ResponseBody;
  }

  return await response.json();
};
