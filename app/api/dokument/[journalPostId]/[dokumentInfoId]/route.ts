import { hentDokument } from 'lib/services/oppslagService';
import { NextApiRequest } from 'next';

export async function GET(
  req: NextApiRequest,
  { params }: { params: { journalPostId: string; dokumentInfoId: string } }
) {
  const blob = await hentDokument(params.journalPostId, params.dokumentInfoId);

  if (blob !== undefined) {
    return new Response(blob, { status: 200, headers: new Headers({ 'Content-Type': blob.type }) });
  } else {
    return new Response(JSON.stringify({ message: 'Ingen dokument funnet.' }), { status: 500 });
  }
}
