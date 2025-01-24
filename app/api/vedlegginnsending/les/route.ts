import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { hentVedlegg } from 'lib/services/innsendingService';
import { NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, res: NextApiResponse) {
  const uuid = getStringFromPossiblyArrayQuery(req.nextUrl.searchParams.get('uuid') ?? '');
  if (!uuid) {
    return new Response(JSON.stringify({ error: 'uuid må være en string' }), { status: 400 });
  }
  // @ts-ignore
  const response = await hentVedlegg(uuid, req, res);
  return new Response(JSON.stringify(response));
}
