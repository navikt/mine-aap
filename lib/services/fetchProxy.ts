'use server';

import { requestOboToken, validateToken } from '@navikt/oasis';
import { getAccessTokenOrRedirectToLogin } from '@navikt/aap-felles-utils';
import { headers } from 'next/headers';
import { randomUUID } from 'crypto';
import { TokenResult } from '@navikt/oasis/dist/token-result';

const NUMBER_OF_RETRIES = 3;

export const getOnBefalfOfToken = async (audience: string, url: string): Promise<string> => {
  const token = getAccessTokenOrRedirectToLogin(await headers());
  if (!token) {
    throw new Error(`Token for simpleTokenXProxy is undefined for ${url}`);
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    throw new Error(`Token for ${url} validerte ikke, med errorType ${validation.errorType}`, validation.error);
  }

  const onBehalfOf = await requestOboTokenWithRetry(token, audience, 2);
  if (!onBehalfOf.ok) {
    throw new Error(`Henting av oboToken for ${url} feilet`, onBehalfOf.error);
  }

  return onBehalfOf.token;
};

const requestOboTokenWithRetry = async (token: string, audience: string, maxRetries: number): Promise<TokenResult> => {
  const oboToken = await requestOboToken(token, audience);
  if (oboToken.ok) {
    return oboToken;
  } else if (maxRetries > 0) {
    return requestOboTokenWithRetry(token, audience, maxRetries - 1);
  }
  return oboToken;
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
    throw new Error(`kunne ikke lese pdf på url ${url}.`);
  }
};

export const fetchWithRetry = async <ResponseBody>(
  url: string,
  method: string,
  oboToken: string,
  retries: number,
  requestBody?: object,
  tags?: string[],
  errors?: string[]
): Promise<ResponseBody> => {
  if (!errors) errors = [];

  if (retries === 0) {
    throw new Error(`Unable to fetch ${url}: `, Error(errors.join('\n')));
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
      throw new Error(`klarte ikke å hente ${url}: ${responseMessage}`);
    }
    if (response.status === 404) {
      throw new Error(`Ikke funnet: ${url}`);
    }

    errors.push(`HTTP ${response.status} ${response.statusText}: ${url} (retries left ${retries})`);
    return await fetchWithRetry(url, method, oboToken, retries - 1, requestBody, tags, errors);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text')) {
    return (await response.text()) as ResponseBody;
  }

  return await response.json();
};
