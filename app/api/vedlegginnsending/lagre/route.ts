import { lagreVedlegg } from 'lib/services/innsendingService';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const lagre = await lagreVedlegg(req);
  if (lagre.ok) {
    return NextResponse.json({ filId: lagre.filId });
  }
}
