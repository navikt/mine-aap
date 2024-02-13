import { logger } from '@navikt/aap-felles-utils';
import { getSession } from '@navikt/oasis/provider/';
import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';

const NAV_CALLID = 'Nav-CallId';

interface Opts {
  req: IncomingMessage;
  audience: string;
  url: string;
}

export const simpleProxy = async (opts: Opts) => {
  const session = await getSession(opts.req);
  const onBehalfOfToken = await session.apiToken(opts.audience);

  const requestId = randomUUID();

  const response = await fetch(opts.url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
      'Content-Type': 'application/json',
      [NAV_CALLID]: requestId,
    },
  });

  if (response.ok) {
    return await response.json();
  }
  logger.error(`simpleProxy to ${opts.url} failed with status ${response.status}`);
  return undefined;
};
