import { hentVedlegg } from 'lib/services/innsendingService';
import { getStringFromPossiblyArrayQuery } from 'lib/utils/request';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const uuid = getStringFromPossiblyArrayQuery(req.nextUrl.searchParams.get('uuid') ?? '');
  if (!uuid) {
    return new Response(JSON.stringify({ error: 'uuid må være en string' }), {
      status: 400,
    });
  }

  return hentVedlegg(uuid, req);
}
