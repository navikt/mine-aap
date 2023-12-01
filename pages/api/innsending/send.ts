import { logger, isMock, beskyttetApi, getAccessTokenFromRequest, tokenXApiProxy } from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';
import { InnsendingBackendState } from 'lib/types/types';

const handler = beskyttetApi(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
  const { filer } = JSON.parse(req.body);
  const body: InnsendingBackendState = {
    filer,
  };
  await sendEttersendelse(body, accessToken);

  /*ettersendteVedlegg.forEach((ettersendelse) => {
    logger.info(`lager metrics for ettersendelse.${ettersendelse.vedleggType}`);
    metrics.ettersendVedleggCounter.inc({ type: ettersendelse.vedleggType });

    metrics.ettersendVedleggSizeHistogram.observe(totalFileSize);
    metrics.ettersendVedleggNumberOfDocumentsHistogram.observe(ettersendelse.ettersending.length);
  });*/

  res.status(201).json({});
});

export const sendEttersendelse = async (data: InnsendingBackendState, accessToken?: string) => {
  if (isMock()) {
    return {};
  }
  const ettersendelse = await tokenXApiProxy({
    url: `${process.env.INNSENDING_URL}/innsending`,
    prometheusPath: '/innsending',
    method: 'POST',
    data: JSON.stringify(data),
    audience: process.env.INNSENDING_URL!,
    bearerToken: accessToken,
    noResponse: true,
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
  return ettersendelse;
};

export default handler;
