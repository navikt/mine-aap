import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetApi, getAccessTokenFromRequest, getTokenX, logger } from '@navikt/aap-felles-utils';
import { proxyApiRouteRequest } from '@navikt/next-api-proxy';

const handler = beskyttetApi(async (req, res) => {
  const uuid = getStringFromPossiblyArrayQuery(req.query.uuid);
  if (!uuid) {
    res.status(400).json({ error: 'uuid må være en string' });
  }

  logger.info(`Les fil: /mellomlagring/fil/${uuid}`);
  const accessToken = getAccessTokenFromRequest(req)?.substring('Bearer '.length)!;

  let tokenxToken;
  try {
    tokenxToken = await getTokenX(accessToken, process.env.INNSENDING_AUDIENCE!);
  } catch (err: any) {
    logger.error(`Noe gikk galt i henting av TokenX i ny innsending LES`);
  }

  return await proxyApiRouteRequest({
    hostname: 'innsending',
    path: `/mellomlagring/fil/${uuid}`,
    req: req,
    res: res,
    bearerToken: tokenxToken,
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
