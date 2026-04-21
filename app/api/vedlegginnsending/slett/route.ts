import { slettVedlegg } from 'lib/services/innsendingService';
import { isSuccess } from 'lib/utils/api-fetch';
import { getStringFromPossiblyArrayQuery } from 'lib/utils/request';
import { type NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  const uuid = getStringFromPossiblyArrayQuery(req.nextUrl.searchParams.get('uuid') ?? '');
  if (!uuid) {
    return new Response(JSON.stringify({ error: 'uuid må være en string' }), {
      status: 400,
    });
  }
  const slett = await slettVedlegg(uuid);
  if (isSuccess(slett)) {
    return NextResponse.json({}, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Noe gikk galt ved sletting av fil.' }, { status: slett.status });
  }
}
