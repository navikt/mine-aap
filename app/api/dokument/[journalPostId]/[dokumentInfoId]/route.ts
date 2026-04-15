import { hentDokument } from 'lib/services/oppslagService';
import type { NextRequest } from 'next/server';

export async function GET(
  _: NextRequest,
  props: { params: Promise<{ journalPostId: string; dokumentInfoId: string }> },
) {
  const params = await props.params;
  const res = await hentDokument(params.journalPostId, params.dokumentInfoId);
  const blob = await res.blob();

  if (blob !== undefined) {
    return new Response(blob, { status: 200, headers: res.headers });
  } else {
    return new Response(JSON.stringify({ message: 'Ingen dokument funnet.' }), {
      status: 500,
    });
  }
}
