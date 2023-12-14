import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { beskyttetApi, getAccessTokenFromRequest, tokenXApiProxy } from '@navikt/aap-felles-utils';

const handler = beskyttetApi(async (req, res) => {
  const uuid = getStringFromPossiblyArrayQuery(req.query.uuid);
  if (!uuid) {
    res.status(400).json({ error: 'uuid må være en string' });
  }
  const accessToken = getAccessTokenFromRequest(req);
  return await tokenXApiProxy({
    url: `${process.env.INNSENDING_URL}/mellomlagring/fil/${uuid}`,
    method: 'DELETE',
    prometheusPath: '/mellomlagring/fil',
    req,
    audience: process.env.INNSENDING_AUDIENCE!,
    bearerToken: accessToken,
    noResponse: true,
  });
});

export default handler;