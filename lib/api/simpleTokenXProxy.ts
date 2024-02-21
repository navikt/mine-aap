import { logError, logInfo } from '@navikt/aap-felles-utils';
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
    logError(`Request for ${url} er undefined`);
    throw new Error('Request for simpleTokenXProxy is undefined');
  }

  const session = await getSession(req);
  const onBehalfOfToken = await session.apiToken(audience);

  const navCallId = randomUUID();

  logInfo(`${req.method} ${url}, callId ${navCallId}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
      'Content-Type': 'application/json',
      'Nav-CallId': navCallId,
    },
  });

  if (response.ok) {
    logInfo(`OK ${url}, status ${response.status}, callId ${navCallId}`);
    return await response.json();
  }
  logError(
    `Error fetching simpleTokenXProxy. Fikk responskode ${response.status} fra ${url} med navCallId: ${navCallId}`
  );
  throw new Error('Error fetching simpleTokenXProxy');
};
