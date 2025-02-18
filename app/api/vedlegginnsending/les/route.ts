import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { hentVedlegg } from 'lib/services/innsendingService';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const uuid = getStringFromPossiblyArrayQuery(req.nextUrl.searchParams.get('uuid') ?? '');
  if (!uuid) {
    return new Response(JSON.stringify({ error: 'uuid må være en string' }), { status: 400 });
  }

  return hentVedlegg(uuid, req);
}
