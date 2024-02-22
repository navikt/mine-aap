import { validateToken, requestOboToken, getToken } from '@navikt/oasis';
import { logError, logInfo } from '@navikt/aap-felles-utils';
import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';

interface Opts {
  url: string;
  method?: 'GET' | 'POST' | 'DELETE';
  audience: string;
  body?: object;
  req?: IncomingMessage;
}

export const simpleTokenXProxy = async <T>({ url, audience, req, method = 'GET', body }: Opts): Promise<T> => {
  if (!req) {
    logError(`Request for ${url} er undefined`);
    throw new Error('Request for simpleTokenXProxy is undefined');
  }

  const token = getToken(req);
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
    logError(`Henting av oboToken for ${url} feilet`);
    throw new Error('Request oboToken for simpleTokenXProxy failed');
  }

  const navCallId = randomUUID();

  logInfo(`${req.method} ${url}, callId ${navCallId}`);

  const response = await fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${onBehalfOf.token}`,
      'Content-Type': 'application/json',
      'Nav-CallId': navCallId,
    },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  });

  if (response.ok) {
    logInfo(`OK ${url}, status ${response.status}, callId ${navCallId}`);
    const headers = response.headers.get('content-type');
    const isJson = headers?.includes('application/json');

    // TODO: Midlertidig, til innsending returnerer json på alle OK-responser
    if (!isJson) {
      return (await response.text()) as T;
    }
    return await response.json();
  }
  logError(
    `Error fetching simpleTokenXProxy. Fikk responskode ${response.status} fra ${url} med navCallId: ${navCallId}`
  );
  throw new Error('Error fetching simpleTokenXProxy');
};
