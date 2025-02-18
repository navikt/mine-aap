import { hentSøknader } from 'lib/services/innsendingService';
import { NextApiRequest } from 'next';

const allowedOrigins = [
  'https://www.intern.dev.nav.no',
  'https://www.ansatt.dev.nav.no',
  'https://aap-mine-aap.intern.dev.nav.no',
  'https://aap-mine-aap.ansatt.dev.nav.no',
  'https://www.nav.no',
];

export async function GET(req: NextApiRequest) {
  const soknader = await hentSøknader();
  const origin = req.headers.origin ?? '';

  return new Response(JSON.stringify(soknader), {
    status: 200,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers':
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
  });
}
