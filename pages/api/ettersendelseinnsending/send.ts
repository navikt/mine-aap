import { beskyttetApi, getAccessTokenFromRequest, isMock, logger, tokenXApiProxy } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';
import { Ettersendelse, InnsendingBackendState, VedleggType } from 'lib/types/types';

const handler = beskyttetApi(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
  const { ettersendteVedlegg, søknadId }: Ettersendelse = JSON.parse(req.body);

  const ettersending = ettersendteVedlegg[0];
  const body: InnsendingBackendState = {
    filer: ettersending.ettersending.map((ettersendtVedlegg) => ({
      id: ettersendtVedlegg,
      tittel: mapVedleggTypeTilVedleggstekst(ettersending.vedleggType),
    })),
  };
  await sendEttersendelseInnsending(body, søknadId, accessToken);

  res.status(201).json({});
});

export const sendEttersendelseInnsending = async (
  data: InnsendingBackendState,
  innsendingsId?: string,
  accessToken?: string
) => {
  if (isMock()) {
    return {};
  }
  const ettersendelse = await tokenXApiProxy({
    url: `${process.env.INNSENDING_URL}/innsending${innsendingsId ? `/${innsendingsId}` : ''}`,
    prometheusPath: '/innsending',
    method: 'POST',
    data: JSON.stringify(data),
    audience: process.env.INNSENDING_AUDIENCE!,
    bearerToken: accessToken,
    noResponse: true,
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
  return ettersendelse;
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
