import { beskyttetApi } from '@navikt/aap-felles-utils';
import { getSøknaderInnsending } from 'pages/api/soknader/soknader';

const allowedOrigins = [
  'https://www.intern.dev.nav.no',
  'https://aap-mine-aap.intern.dev.nav.no',
  'https://aap-mine-aap.ansatt.dev.nav.no',
  'https://www.nav.no',
];

const handler = beskyttetApi(async (req, res) => {
  const søknader = await getSøknaderInnsending(req);
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(req.headers.origin) ? req.headers.origin : '');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  }

  res.status(200).json(søknader);
});

export default handler;
