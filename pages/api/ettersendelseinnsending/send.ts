import { beskyttetApi, isMock } from '@navikt/aap-felles-utils';
import { IncomingMessage } from 'http';
import { simpleTokenXProxy } from 'lib/api/simpleTokenXProxy';
import { Ettersendelse, InnsendingBackendState, VedleggType } from 'lib/types/types';

const handler = beskyttetApi(async (req, res) => {
  const { ettersendteVedlegg, søknadId }: Ettersendelse = JSON.parse(req.body);

  const ettersending = ettersendteVedlegg[0];
  const body: InnsendingBackendState = {
    filer: ettersending.ettersending.map((ettersendtVedlegg) => ({
      id: ettersendtVedlegg,
      tittel: mapVedleggTypeTilVedleggstekst(ettersending.vedleggType),
    })),
  };
  await sendEttersendelseInnsending(body, søknadId, req);

  res.status(201).json({});
});

export const sendEttersendelseInnsending = async (
  data: InnsendingBackendState,
  innsendingsId?: string,
  req?: IncomingMessage
) => {
  if (isMock()) {
    return {};
  }
  try {
    const ettersendelse = await simpleTokenXProxy({
      url: `${process.env.INNSENDING_URL}/innsending${innsendingsId ? `/${innsendingsId}` : ''}`,
      audience: process.env.INNSENDING_AUDIENCE!,
      method: 'POST',
      req,
      body: data,
    });
    return ettersendelse;
  } catch (error) {
    throw new Error('Error sending ettersendelse');
  }
};

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

export default handler;
