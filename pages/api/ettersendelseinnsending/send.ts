import { beskyttetApi, getAccessTokenFromRequest, isMock, logger, tokenXApiProxy } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';
import { Ettersendelse, InnsendingBackendState } from 'lib/types/types';

const handler = beskyttetApi(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
  const { ettersendteVedlegg }: Ettersendelse = JSON.parse(req.body);

  const ettersending = ettersendteVedlegg[0];
  const body: InnsendingBackendState = {
    filer: ettersending.ettersending.map((ettersendtVedlegg) => ({
      id: ettersendtVedlegg,
      tittel: ettersending.vedleggType,
    })),
  };
  await sendEttersendelseInnsending(body, accessToken);

  res.status(201).json({});
});

export const sendEttersendelseInnsending = async (data: InnsendingBackendState, accessToken?: string) => {
  if (isMock()) {
    return {};
  }
  const ettersendelse = await tokenXApiProxy({
    url: `${process.env.INNSENDING_URL}/innsending`,
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

export default handler;