import { logger } from '@navikt/aap-felles-utils';
import { getSession } from '@navikt/oasis';
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
    logger.error(`Request for ${url} er undefined`);
    throw new Error('Request for simpleTokenXProxy is undefined');
  }

  const session = await getSession(req);
  const onBehalfOfToken = await session.apiToken(audience);

  const navCallId = randomUUID();

  logger.info(`Starter request mot ${url} med callId ${navCallId}`);

  const response = await fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
      'Content-Type': 'application/json',
      'Nav-CallId': navCallId,
    },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  });

  if (response.ok) {
    logger.info(`Vellykket request mot ${url} med callId ${navCallId}`);
    return await response.json();
  }
  logger.error(
    `Error fetching simpleTokenXProxy. Fikk responskode ${response.status} fra ${url} med navCallId: ${navCallId}`
  );
  throw new Error('Error fetching simpleTokenXProxy');
};
