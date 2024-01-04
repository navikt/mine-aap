import { logger, isMock, beskyttetApi, getAccessTokenFromRequest, tokenXApiProxy } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';
import { Ettersendelse, EttersendelseBackendState, InnsendingBackendState } from 'lib/types/types';

const handler = beskyttetApi(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
  const { ettersendteVedlegg, søknadId, totalFileSize }: Ettersendelse = JSON.parse(req.body);

  if (process.env.NY_INNSENDING === 'enabled') {
    const ettersending = ettersendteVedlegg[0];
    const body: InnsendingBackendState = {
      filer: ettersending.ettersending.map((ettersendtVedlegg) => ({
        id: ettersendtVedlegg,
        tittel: ettersending.vedleggType,
      })),
    };
    await sendEttersendelseInnsending(body, accessToken);
    res.status(201).json({});
  } else {
    const body: EttersendelseBackendState = {
      ...(søknadId && { søknadId: søknadId }),
      ettersendteVedlegg,
    };

    await sendEttersendelse(body, accessToken);

    ettersendteVedlegg.forEach((ettersendelse) => {
      logger.info(`lager metrics for ettersendelse.${ettersendelse.vedleggType}`);
      metrics.ettersendVedleggCounter.inc({ type: ettersendelse.vedleggType });

      metrics.ettersendVedleggSizeHistogram.observe(totalFileSize);
      metrics.ettersendVedleggNumberOfDocumentsHistogram.observe(ettersendelse.ettersending.length);
    });

    res.status(201).json({});
  }
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
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
  return ettersendelse;
};

export default handler;
