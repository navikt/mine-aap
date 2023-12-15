import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetApi, getAccessTokenFromRequest, getTokenX } from '@navikt/aap-felles-utils';
import { proxyApiRouteRequest } from '@navikt/next-api-proxy';

const handler = beskyttetApi(async (req, res) => {
  const uuid = getStringFromPossiblyArrayQuery(req.query.uuid);
  if (!uuid) {
    res.status(400).json({ error: 'uuid må være en string' });
  }

  const accessToken = getAccessTokenFromRequest(req)?.substring('Bearer '.length)!;
  let tokenxToken;
  try {
    tokenxToken = await getTokenX(accessToken, process.env.INNSENDING_AUDIENCE!);
  } catch (err: any) {
    console.log('getTokenXError', err);
  }
  return await proxyApiRouteRequest({
    hostname: 'innsending',
    path: `/mellomlagring/fil/${uuid}`,
    req: req,
    /* @ts-ignore: TODO */
    res: res,
    bearerToken: tokenxToken,
    https: false,
  });
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default handler;
