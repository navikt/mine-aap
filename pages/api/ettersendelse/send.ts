import { beskyttetApi, getAccessTokenFromRequest, isMock, logInfo, tokenXApiProxy } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';
import { Ettersendelse, EttersendelseBackendState } from 'lib/types/types';

const handler = beskyttetApi(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
  const { ettersendteVedlegg, søknadId, totalFileSize }: Ettersendelse = JSON.parse(req.body);

  const body: EttersendelseBackendState = {
    ...(søknadId && { søknadId: søknadId }),
    ettersendteVedlegg,
  };

  await sendEttersendelse(body, accessToken);

  ettersendteVedlegg.forEach((ettersendelse) => {
    logInfo(`lager metrics for ettersendelse.${ettersendelse.vedleggType}`);
    metrics.ettersendVedleggCounter.inc({ type: ettersendelse.vedleggType });

    metrics.ettersendVedleggSizeHistogram.observe(totalFileSize);
    metrics.ettersendVedleggNumberOfDocumentsHistogram.observe(ettersendelse.ettersending.length);
  });

  res.status(201).json({});
});

export const sendEttersendelse = async (data: EttersendelseBackendState, accessToken?: string) => {
  if (isMock()) {
    return {};
  }
  const ettersendelse = await tokenXApiProxy({
    url: `${process.env.SOKNAD_API_URL}/innsending/ettersend`,
    prometheusPath: '/innsending/ettersend',
    method: 'POST',
    data: JSON.stringify(data),
    audience: process.env.SOKNAD_API_AUDIENCE!,
    bearerToken: accessToken,
    noResponse: true,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
  return ettersendelse;
};

export default handler;
