import { logger } from '@navikt/aap-felles-utils';
import { getSession } from '@navikt/oasis';
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

  const session = await getSession(req);
  const onBehalfOfToken = await session.apiToken(audience);

  const navCallId = randomUUID();

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
      'Content-Type': 'application/json',
      'Nav-CallId': navCallId,
    },
  });

  if (response.ok) {
    return await response.json();
  }
  logger.error(`Error fetching simpleTokenXProxy. Fikk responskode ${response.status} fra ${url}`);
  throw new Error('Error fetching simpleTokenXProxy');
};
