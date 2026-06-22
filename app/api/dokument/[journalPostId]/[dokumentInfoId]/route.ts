import { hentDokument } from 'lib/services/oppslagService';
import type { NextRequest } from 'next/server';

export async function GET(
  _: NextRequest,
  props: { params: Promise<{ journalPostId: string; dokumentInfoId: string }> }
) {
  const params = await props.params;
  return hentDokument(params.journalPostId, params.dokumentInfoId);
}
