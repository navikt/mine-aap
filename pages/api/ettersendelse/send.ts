import { NextApiRequest, NextApiResponse } from 'next';
import {
  logger,
  isMock,
  beskyttetApi,
  getAccessTokenFromRequest,
  tokenXApiProxy,
} from '@navikt/aap-felles-innbygger-utils';
import metrics from 'lib/metrics';
import { Ettersendelse, EttersendelseBackendState } from 'lib/types/types';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = getAccessTokenFromRequest(req);
  const { ettersendteVedlegg, søknadId, totalFileSize }: Ettersendelse = JSON.parse(req.body);
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
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
  return ettersendelse;
};

export default handler;
