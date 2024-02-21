import { logger } from '@navikt/aap-felles-utils';
import { validateToken, requestOboToken, getToken } from '@navikt/oasis';
import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';

interface Opts {
  url: string;
  audience: string;
  req?: IncomingMessage;
}

export const simpleTokenXProxy = async ({ url, audience, req }: Opts) => {
  if (!req) {
    logger.error(`Request for ${url} er undefined`);
    throw new Error('Request for simpleTokenXProxy is undefined');
  }

  const token = getToken(req);
  if (!token) {
    logger.error(`Token for ${url} er undefined`);
    throw new Error('Token for simpleTokenXProxy is undefined');
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    logger.error(`Token for ${url} validerte ikke`);
    throw new Error('Token for simpleTokenXProxy didnt validate');
  }

  const onBehalfOf = await requestOboToken(token, audience);
  if (!onBehalfOf.ok) {
    logger.error(`Henting av oboToken for ${url} feilet`);
    throw new Error('Request oboToken for simpleTokenXProxy failed');
  }

  const navCallId = randomUUID();

  logger.info(`Starter request mot ${url} med callId ${navCallId}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${onBehalfOf.token}`,
      'Content-Type': 'application/json',
      'Nav-CallId': navCallId,
    },
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
