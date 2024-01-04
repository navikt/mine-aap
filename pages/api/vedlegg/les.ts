import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetApi, getTokenX } from '@navikt/aap-felles-utils';
import { tokenXProxy } from '../../../lib/api/tokenXProxy';
import { proxyApiRouteRequest } from '@navikt/next-api-proxy';

const handler = beskyttetApi(async (req, res) => {
  const uuid = getStringFromPossiblyArrayQuery(req.query.uuid);
  if (!uuid) {
    res.status(400).json({ error: 'uuid må være en string' });
  }
  if (process.env.NY_INNSENDING === 'enabled') {
    // @ts-ignore-line TODO: Feil med type for NextApiResponse vi henter fra felleslib
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
  }
  /* @ts-ignore: TODO: Følge opp med tokenXproxy repo for å fikse type */
  return await tokenXProxy(req, res, `/vedlegg/les/${uuid}`, '/vedlegg/les');
});

export const config = {
  api: {
    responseLimit: '50mb',
    bodyParser: false,
    externalResolver: true,
  },
};

export default handler;
