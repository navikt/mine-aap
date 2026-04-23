import { slettVedlegg } from 'lib/services/innsendingService';
import { isSuccess } from 'lib/utils/api-fetch';
import { getStringFromPossiblyArrayQuery } from 'lib/utils/request';
import { type NextRequest, NextResponse } from 'next/server';

const UUID_V1_TO_V5_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function DELETE(req: NextRequest) {
  const uuid = getStringFromPossiblyArrayQuery(req.nextUrl.searchParams.get('uuid') ?? '');
  if (!uuid || !UUID_V1_TO_V5_REGEX.test(uuid)) {
    return new Response(JSON.stringify({ error: 'uuid må være en gyldig UUID string' }), {
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
