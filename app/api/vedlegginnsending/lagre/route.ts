import { lagreVedlegg } from 'lib/services/innsendingService';

export async function POST(req: Request) {
  return lagreVedlegg(req);
}
