import { randomUUID } from 'crypto';
import { isMock, beskyttetApi, logInfo } from '@navikt/aap-felles-utils';
import { getOnBefalfOfToken } from 'lib/api/simpleTokenXProxy';
import { proxyApiRouteRequest } from '@navikt/next-api-proxy';

const handler = beskyttetApi(async (req, res) => {
  logInfo('Har mottatt request om filopplasting i vedlegg innsending');

  if (isMock()) res.status(201).json({ filId: randomUUID() });

  const url = `/mellomlagring/fil`;
  const onBehalfOfToken = await getOnBefalfOfToken(process.env.INNSENDING_AUDIENCE!, url, req);

  return await proxyApiRouteRequest({
    hostname: 'innsending',
    path: `/mellomlagring/fil`,
    req: req,
    res: res,
    bearerToken: onBehalfOfToken,
    https: false,
  });
});

export const config = {
  api: {
    responseLimit: '50mb',
    bodyParser: false,
    externalResolver: true,
  },
};

export default handler;
