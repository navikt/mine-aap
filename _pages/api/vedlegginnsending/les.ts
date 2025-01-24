import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetApi, logInfo } from '@navikt/aap-felles-utils';
import { proxyApiRouteRequest } from '@navikt/next-api-proxy';
import { getOnBefalfOfToken } from 'lib/api/simpleTokenXProxy';

const handler = beskyttetApi(async (req, res) => {
  const uuid = getStringFromPossiblyArrayQuery(req.query.uuid);
  if (!uuid) {
    res.status(400).json({ error: 'uuid må være en string' });
  }

  const url = `/mellomlagring/fil/${uuid}`;
  const onBehalfOfToken = await getOnBefalfOfToken(process.env.INNSENDING_AUDIENCE!, url, req);

  logInfo(`Les fil: ${url}`);

  return await proxyApiRouteRequest({
    hostname: 'innsending',
    path: `/mellomlagring/fil/${uuid}`,
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
