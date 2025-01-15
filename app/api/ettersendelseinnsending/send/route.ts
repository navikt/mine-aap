import { logError } from '@navikt/aap-felles-utils';
import { sendEttersendelse } from 'lib/services/innsendingService';
import { Ettersendelse, InnsendingBackendState, VedleggType } from 'lib/types/types';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { ettersendteVedlegg, søknadId }: Ettersendelse = body;

  const ettersending = ettersendteVedlegg[0];
  const requestBody: InnsendingBackendState = {
    filer: ettersending.ettersending.map((ettersendtVedlegg) => ({
      id: ettersendtVedlegg,
      tittel: mapVedleggTypeTilVedleggstekst(ettersending.vedleggType),
    })),
  };
  try {
    await sendEttersendelse(requestBody, søknadId);
    return new Response(null, { status: 201 });
  } catch (error) {
    logError('Error sending ettersendelse', error);
    return new Response('Error sending ettersendelse', { status: 500 });
  }
}

function mapVedleggTypeTilVedleggstekst(vedleggType: VedleggType): string {
  switch (vedleggType) {
    case 'ANDREBARN':
      return 'Dokumentasjon av andre barn';
    case 'OMSORG':
      return 'Dokumentasjon av omsorgsstønad fra kommunen';
    case 'STUDIER':
      return 'Dokumentasjon av studier';
    case 'UTLAND':
      return 'Dokumentasjon av ytelser fra utenlandske trygdemyndigheter';
    case 'ARBEIDSGIVER':
      return 'Dokumentasjon av ekstra utbetaling fra arbeidsgiver';
    case 'ANNET':
      return 'Annen dokumentasjon';
    default:
      return vedleggType;
  }
}
