import { hentDokument } from 'lib/services/oppslagService';
import { NextApiRequest } from 'next';

export async function GET(
  req: NextApiRequest,
  { params }: { params: { journalPostId: string; dokumentInfoId: string } }
) {
  const res = await hentDokument(params.journalPostId, params.dokumentInfoId);
  const blob = await res.blob();

  if (blob !== undefined) {
    return new Response(blob, { status: 200, headers: res.headers });
  } else {
    return new Response(JSON.stringify({ message: 'Ingen dokument funnet.' }), { status: 500 });
  }
}
