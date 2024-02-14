import { beskyttetApi, getAccessTokenFromRequest } from '@navikt/aap-felles-utils';
import { getSøknaderInnsending } from 'pages/api/soknader/soknader';

const handler = beskyttetApi(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
  const søknader = await getSøknaderInnsending(accessToken);
  res.status(200).json(søknader);
});

export default handler;
