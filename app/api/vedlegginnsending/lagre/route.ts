import { lagreVedlegg } from 'lib/services/innsendingService';
import { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const response = await lagreVedlegg(req, res);
  console.log('response', response);
  return new Response(JSON.stringify(response));
}
