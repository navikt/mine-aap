'use server';

import { randomUUID } from 'node:crypto';
import { getToken, requestOboToken, type TokenResult, validateToken } from '@navikt/oasis';
import { logError, logWarning } from 'lib/server/logger';
import { hentLocalToken } from 'lib/services/localFetch';
import type { FetchResponse } from 'lib/utils/api-fetch';
import { isLocal } from 'lib/utils/environments';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const NUMBER_OF_RETRIES = 3;
const REQUEST_TIMEOUT_MS = 60_000; // 60 sekunder, samme som RestClient default i Kelvin komponenter

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
): Promise<FetchResponse<ResponseBody>> => {
  const oboToken = isLocal() ? await hentLocalToken(scope) : await getOnBefalfOfToken(scope, url);
  return await fetchWithRetry<ResponseBody>(url, method, oboToken, NUMBER_OF_RETRIES, requestBody, tags);
};

export const fetchPdf = async (url: string, scope: string): Promise<Response> => {
  const callid = randomUUID();
  const oboToken = isLocal() ? await hentLocalToken(scope) : await getOnBefalfOfToken(scope, url);
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
  tags?: string[]
): Promise<FetchResponse<ResponseBody>> => {
  try {
    // const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    // const combinedSignal = options.signal ? AbortSignal.any([options.signal, timeoutSignal]) : timeoutSignal;

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
      return { type: 'SUCCESS', status: response.status, data: undefined as ResponseBody };
    }

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      // 500 feil fra innsending og oppslag har tekst i body
      const feilmelding = contentType?.includes('text') ? await response.text() : await response.json();
      if (response.status >= 500) {
        logError(`HTTP ${response.status} mot ${url}: ${feilmelding}`);
      } else {
        logWarning(`HTTP ${response.status} mot ${url}: ${feilmelding}`);
      }
      return { type: 'ERROR', apiException: feilmelding, status: response.status };
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text')) {
      return { type: 'SUCCESS', status: response.status, data: (await response.text()) as ResponseBody };
    }
    const responseJson: ResponseBody = await response.json();

    return { type: 'SUCCESS', status: response.status, data: responseJson };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      logWarning(`Timeout mot ${url} etter ${REQUEST_TIMEOUT_MS / 1000} sekunder.`);

      return {
        type: 'ERROR',
        apiException: { message: 'Det tok for lang tid å få svar fra tjenesten. Prøv igjen om litt.' },
        status: 408, // Request Timeout
      };
    }

    // Fanger uhåndterte nettverksfeil som f.eks.: ECONNRESET, ETIMEDOUT, osv.
    logWarning(`Nettverksfeil mot ${url}: `, error);

    if (retries > 1 && method === 'GET') {
      const delayMs = (NUMBER_OF_RETRIES - retries + 1) * 1000; // Økende delay: 1s, 2s, 3s...
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return await fetchWithRetry(url, method, oboToken, retries - 1, requestBody, tags);
    }

    logWarning(`For mange nettverksfeil (${method} ${url}): `, error);
    return {
      type: 'ERROR',
      apiException: { message: `Fikk ikke svar fra tjenesten. Prøv igjen om litt.` },
      status: 503, // Service Unavailable
    };
  }
};

function getAccessTokenOrRedirectToLogin(headers: Headers): string {
  if (isLocal()) return 'fake-token';

  const redirectPath = headers.get('x-path');
  const token = getToken(headers);
  if (!token) {
    redirect(`/oauth2/login?redirect=${redirectPath}`);
  }

  return token;
}
