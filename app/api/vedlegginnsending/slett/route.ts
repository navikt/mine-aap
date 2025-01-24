import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { slettVedlegg } from 'lib/services/innsendingService';
import { NextRequest } from 'next/server';

export async function DELETE(req: NextRequest) {
  const uuid = getStringFromPossiblyArrayQuery(req.nextUrl.searchParams.get('uuid') ?? '');
  if (!uuid) {
    return new Response(JSON.stringify({ error: 'uuid må være en string' }), { status: 400 });
  }
  await slettVedlegg(uuid);
  return new Response('{}', { status: 200 });
}
